var db = require("../models");
var express = require("express");
var router = express.Router();
var Yelp = require("../APIs/yelpAPI.js");
// moment js for cheking time
var moment = require('moment-timezone');
// passport setup
var passport = require('passport')
 , LocalStrategy = require('passport-local').Strategy,
   FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
	console.log("user info new: " + JSON.stringify(user))
	// console.log("user type:" + user.type)
	console.log("serialize User working");
	console.log("object size" + Object.keys(user).length);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
	console.log("id: " + JSON.stringify(user));
	// console.log("type: " + user.type);
	if ( Object.keys(user).length < 7 ) {
	  db.Users.findOne({where: {id:user.id}}). then(function(user) {
	  	console.log("found it")
	    done(null, user);
	  });
	} else {
		db.Business.findOne({where: {id:user.id}}). then(function(user) {
	  	console.log("found it")
	    done(null, user);
	  });
	}
});

// ================== use passport -facebook =========================
passport.use(new FacebookStrategy({
    clientID: "1520008688037320",
    clientSecret: "00599922a45da99db7e9d06127c04b94"
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log("facebook info"+ JSON.stringify(profile))
    db.Users.findOrCreate({where: {
    	id: profile.id,
    	name: profile.first_name
    }}).then(function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
 }));   

// user sign up and automatic log-in
passport.use('local-signup', new LocalStrategy({
   usernameField: "email",
   passReqToCallback : true
  },
  function(req, email, password, done) {
    findOrCreateUser = function(){
    	console.log("works up tp here")
    	console.log("email: " + JSON.stringify(req.body));
    	console.log("password: " + password)
      // find a user in Mongo with provided username
      db.Users.findOne({where: {'email' : email}}).then(function( user) {
      	console.log("db search suceesfull")
        // In case of any error return
        if (user) {
          console.log('User already exists');
          return done(null, false, 
             req.flash('message','User Already Exists'));
        } else {
         	 // save the user
         	db.Users.create(req.body).then(function(dbUser) {
            	// if (err){
            	//   console.log('Error in Saving user: '+err);  
            	//   throw err;  
            	// }
            	console.log('User Registration succesful');   
            	 
            	return done(null, dbUser.get());
          	});
        }
      })
    }
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  })
);	

//=====================  local business sign up===========================
passport.use('local-business', new LocalStrategy({
   usernameField: "email",
   passReqToCallback : true
  },
  function(req, email, password, done) {
    findOrCreateUser = function(){
    	console.log("works up tp here")
    	console.log("email: " + JSON.stringify(req.body));
    	console.log("password: " + password)
      // find a user in Mongo with provided username
      db.Business.findOne({where: {'email' : email}}).then(function(user) {
      	console.log("db search suceesfull")
        // In case of any error return
         if (user) {
          console.log('User already exists');
          return done(null, false, 
             req.flash('message','User Already Exists'));
        } else {
         	 // save the user
         	db.Business.create(req.body).then(function(dbUser) {
            	// if (err){
            	//   console.log('Error in Saving user: '+err);  
            	//   throw err;  
            	// }
            	console.log('User Registration succesful');   
            	 
            	return done(null, dbUser.get());
          	});
        }
      })
    }
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  })
);	

// ======================== use passport local strategy ====================
passport.use('login', new LocalStrategy({
	usernameField: "email",
    passReqToCallback : true
  },
  function(req, username, password, done) { 
  	console.log("login Strategy working ");
  	console.log(username);
  	console.log(password);
    // check in mongo if a user with username exists or not
    db.Users.findOne({where: {
    	'email': username}
    }). 
      then(function(user) {
      	console.log("sign in worked");
      	console.log("user:  " + JSON.stringify(user))
        // In case of any error, return using the done method
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with email '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (password != user.password){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
       
        // console.log(JSON.stringify(user))
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user.get());
      }
    );
}));
// / passport/login.js - business
passport.use('Blogin', new LocalStrategy({
	usernameField: "email",
    passReqToCallback : true
  },
  function(req, username, password, done) { 
  	console.log("login Strategy working ");
  	console.log(username);
  	console.log(password);
    // check in mongo if a user with username exists or not
    db.Business.findOne({where: {
    	'email': username}
    }). 
      then(function(user) {
      	console.log("sign in worked");
      	console.log("business user:  " + JSON.stringify(user))
        // In case of any error, return using the done method
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with email '+ username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (password != user.password){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        
        // console.log(JSON.stringify(user))
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user.get());
      }
    );
}));


// ===================== end passport setu up ====================================

// =======================================================================



var router = express.Router();

// ===================== customer/user routes =========================

	router.get('/auth/facebook', passport.authenticate('facebook'));

	router.get("auth/facebook/callback",
		passport.authenticate('facebook', { successRedirect:'/',
			failureRedirect:'/about'}));

	// route to about page 
	router.get("/about", function(req,res) {
		res.render("about");
	});

	// rdign up route
	// router.post('/user', passport.authenticate('local-signup', {
	// 	successRedirect: '/',
 //    	failureRedirect: '/user/new',
 //    	failureFlash : true 
	// }));

	//  adds new user to database 
	router.post("/user", passport.authenticate(
		'local-signup', {
			successRedirect: '/',
    		failureRedirect: '/user/new',
    		failureFlash : true 
		}
	));

	// router.post("/user", function(req, res) {
	// 	console.log("add user workin");

	// 	const user = new User({ email: req.body.email, password: req.body.password, name: req.body.name });

	// 	db.Users.create(req.body).then(function(dbResults) {
			
	// 		console.log(JSON.stringify(req.body));
	// 		req.login(user, function(err) {
 //        		if (err) {
 //          		console.log(err);
 //        		}
 //       			res.redirect('/about');
 //     		});
	// 		// res.redirect("/");
	// 		// 	res.json(dbUsers);
	// 	});
		
	// });

	// cheks sign in request
	 router.post('/signIn', passport.authenticate('login', {
    	successRedirect: 'back',
    	failureRedirect: '/',
    	failureFlash : true 
  	}));

	
	
	// route for signing out -signs users out redirects them to home page 
	router.get('/signOut', function(req, res) {
	  req.logout();
	  res.redirect('/');
	});

	// express router for main user page
	router.get('/', function(req, res) {
		if (req.user) {
			res.render("index", {layout: 'loggedIn.handlebars', userName: req.user.userName} );
		} else {
			res.render("index");
		}
	})
	

	// express router for deals page
	router.get("/deals/:category/", function(req, res) {
		var category = req.params.category;
		
		var returnObject ={};
		var userId = req.params.userID;
		// console.log(userId);
		// console.log("category: " + category)

		// looks in database for all deals with that category
		db.Deals.findAll({
			where: {
				category: category
			}, 
			include: [db.Business]
		}).then(function(results){

			// console.log("results" + JSON.stringify(results));
			returnObject.deals = results

			// console.log("category: " + category);

			// object for looop cheks time and day if both pass marks as active else incative
			for (key in returnObject.deals) {
				// deals info: start time, end time , and days available
				var startTime = returnObject.deals[key].dealStart;
				var endTime = returnObject.deals[key].dealEnd;
				var days = returnObject.deals[key].daysAvailable; 

				// console.log(startTime + "-" + endTime);
				// console.log("dealStart:======" + startTime);
				
				// runs time chek function if pass deal is active
				 if (timeCheck(startTime, endTime, days)) {
				 	console.log("mark card as active: " + key );
				 	returnObject.deals[key].active = "active"

				 } else {
				 	console.log("mark card as inactive");
					returnObject.deals[key].active = "pending";
				 }
			};	 


			// time check function that checks the results to see if they're active
			function timeCheck(dealStart, dealEnd, daysActive) {
				// var gets current day and time info
				var currentTime = moment().tz("America/Denver");
				var hour = parseInt(currentTime.hour());
				var minute = parseInt(currentTime.minute());
				var day = currentTime.day().toString();
				// if statement that fixes time so that it can be read properly
				if (minute<10) {
					minute= "0" + String(minute)
				}
				// deal active says string - turns to array 
				var days = daysActive.split(",");
				var timeN = parseInt(String(hour) + String(minute));
				var splitStart = dealStart.split(":");
				var splitEnd =dealEnd.split(":");
				var start = parseInt(splitStart[0] + splitStart[1]);
				var end = parseInt(splitEnd[0] + splitEnd[1]);
				var currentTime = parseInt(hour + minute);
				// console logs to trobleshoot
				console.log("days active start: " + daysActive);
				console.log("current day: " +day);
				console.log("days active: " + days);
				console.log("current hour: " + hour)
				console.log("final startTime: " + start);
				console.log("final end time: " + end);
				console.log("final Time: " + timeN);
				console.log("startTime: "+ dealStart + "dealEnd" + dealEnd);

				// cheks to see if today day is part of available days for deal
				if(days.indexOf(day) > -1) {
					// cheks (time) to see if deal is active 
					if ((start < timeN) && (timeN < end)) {
						console.log("deal is active");
						return true;

					} else {
						console.log("deal is inactive")
						return false;
					}
				}	
				// if today the deal is not available
				else {
					console.log("not today deal... inactive");
					return false;
				}
				
			}
			// end time chek function
			

			
			// if user is signed in
			if (req.user) {
				// cjeks databse for user info
				db.Users.findOne({
					where: {
						id: req.user.id
					}, include: [{model: db.Favorites, where: {
						category: category
					}}]
				}).then(function(results) {
					console.log("search results: " + JSON.stringify(results))
					if (results) {
						favorites = results.Favorites;
					} else {
						var favorites = {};
					}

					returnObject.userInfo = results;
					// console.log("active---:  " + returnObject.deals[0].active);
					console.log("return object with users:   " + JSON.stringify(returnObject))
					// needs work not working properly
					if(category== "food") {
						res.render("deals", {deals: returnObject.deals, favorites: favorites, userName: req.user.userName, layout: 'loggedIn.handlebars' });
					} else {
						res.render("funDeals", {deals: returnObject.deals, favorites: favorites, userName: req.user.userName, layout: 'loggedIn.handlebars' });
					}
				})
			
			} 
			// if not logged in
			else {

				// console.log("active??:  " + returnObject.deals[0].active)
				// console.log("return object with users:   " + JSON.stringify(returnObject))
				// console.log("deals: ======= " + JSON.stringify(results));
				// console.log("return object:   " + JSON.stringify(returnObject));
				if (category == "food") {
					res.render("deals", { deals: returnObject.deals});
				} else {
					res.render("funDeals", { deals: returnObject.deals});
				}
			}
		});
	});

	// express route for search
	router.get("/search/:category", function(req,res) {
		// if (req.query.term != "undefined") {
		// 	console.log(req.query.term);
		// }
		// if (req.query.location != "undefined") {
		// 	console.log(req.query.location);
		// }
		var query = {location: " Denver, co"};
		if (req.params.category === "fun") {
			query.categories = "active";
		} else {
			query.categories = "food";
		}
		for (key in req.query) {
			if (req.query[key] ) {
				console.log([key]);
				console.log(req.query[key])
				console.log("if present: " + req.query[key]);
				query[key] = req.query[key].toString();
			}	
		}
		console.log(JSON.stringify(query))
		
		// console.log(req.query.location);
		// console.log(req.query.category);
		// console.log(req.query.price);
		// console.log(req.query.limit);
		// console.log("searchworking");
		// cheks to see which category of deals to show
		var category = req.params.category;
		// var obj = {location: " denver, co"};
		Yelp.apiCall(query, function (data) {
			// console.log("yelp data: " + data)
			// if looged in 
			if (req.user) {
				// searches database for user favorites
				db.Users.findOne({
					where: {
						id: req.user.id
					}, include: [{model: db.Favorites, where: {
						category: category
					}}]
				}).then(function(results) {
					// console.log("favorites results: " + JSON.stringify(results));
					if (results != null) {
						var favorites = results.Favorites;
					} else {
						var favorites = {};
					}

					// object for loop that adds user id info 
				for (key in data) {
					data[key].uId = req.user.id;
					data[key].category = category;
				}

				if (category=="food") {
					res.render("search", {bInfo: data, favorites: favorites, userName: req.user.userName, layout:'loggedIn.handlebars'});
				} else {
					res.render("funSearch", {bInfo: data, favorites: favorites, userName: req.user.userName, layout:'loggedIn.handlebars'});
				}
				})
			} 
			// if not logged in
			 else {
				if (category == "food") {
					res.render("search", {bInfo: data})
				} else {
					res.render("funSearch", {bInfo: data})
				}		
			}
		});
		// console.log(JSON.stringify(Yelp.apiCall(obj)))
	});
	// router.post()

	// express route for user favorites
	router.get("/favorites/:userId", function(req, res) {
		console.log("favorites page workin");
		var query ={};
		query.UserID = req.params.userId
		var userId = req.params.userId;
		db.Favorites.findAll({
			where: query,
			include:[db.Users]
		}).then(function(results) {
			console.log("favorite object results" + results);
			res.render("favorites", results);
		})
	});

	// express router for new user sign up page
	router.get("/user/new", function(req, res) {
		console.log("current working");
		res.render("newUser");
	});
// =========================================================================
// =============================business side routes ============================
// ===========================================================================	
	
	router.post("/business", passport.authenticate(
		'local-business', {
			successRedirect: '/business/main',
    		failureRedirect: '/business/new',
    		failureFlash : true 
		}
	));


	router.post("/bSignIN", passport.authenticate('Blogin', {
    	successRedirect: '/business/main',
    	failureRedirect: '/business/index',
    	failureFlash : true 
  	}));
	
	// express route for businees user sign in	
	router.get("/business/index/", function(req, res) {
		 req.logout();
		console.log("get working");
		var bsId = req.params.bsId;
		var DecodedId = (bsId /9) -173;
		if (bsId>100) {
			businessSignedIn = true;
			bsignedIn_Id = DecodedId;
			res.redirect("/business/main");
		} else {
			res.render("signIn", {layout: "businessPage.handlebars"});	
		} 
	});

	// route for main business page
	router.get("/business/main", function(req, res) {
		var returnObject={};
		console.log("request user:" + JSON.stringify(req.user))
		console.log("request:" + JSON.stringify(req.businessUser))

		if (req.user) {	
			db.Business.findOne({
				where: {
					id: req.user.id
				}, include: [db.Deals]
			}).then(function(results) {
				console.log("business main working:  " + JSON.stringify(results));
				returnObject.deals = results;
              
            // in case user was signed in on user side
              	// cheks if it found results with user email
				if (results != null) {	
					//  if account found with same email cheks password
					if (req.user.password == results.password) {
						console.log("main business page granted ");
						res.render("bMain", {deals: returnObject.deals, bId: results.id, businessUser: results.contactName, layout: "businessPage.handlebars"});
					}
					//  passwords or sername didnt mathch ==> redirect to sign in page 
					else {
						res.redirect("/business/index");
					}
				} else {
					res.redirect("/business/index")
				}	
			})
		}	else {
			res.redirect("/business/index");
		}
		
	});
	
	// route for new business profile page
	router.get("/business/new", function(req, res) {
		console.log("get working")
		 res.render("newBusiness",  {layout: "businessPage.handlebars"})	 
	});

	// route that displays new deal page
	router.get("/business/new-deal", function(req,res) {
		console.log("new deal page working");
		if (businessSignedIn) {
			console.log("businessId: " + bsignedIn_Id);
			db.Business.findOne({
				where: {
					id: bsignedIn_Id
				}
			}).then(function(results) {
				console.log("bussiness results: " + results)
				console.log("new deal results: " + results);
				res.render("newDeal", {id: results.id, layout: "businessPage.handlebars"})
			});
		} else {
			res.redirect("/business/index");
		}	
	});


	// route thta shows all dals for bussiness
	router.get("/business/current/:userId", function(req, res) {
		var query={};
		var businessId = req.params.userId;
		query.BusinessId = businessId;
		db.Deals.findAll({
			where: query, 
			include: [db.Business]
		}).then(function(results) {
			res.render("current", results)
		})
		
	});



// }	
module.exports = router;