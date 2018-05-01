var db = require("../models");
var express = require("express");
var router = express.Router();
var Yelp = require("../APIs/yelpAPI.js");
var helpers = './helpers.js'
// moment js for cheking time
var moment = require('moment-timezone');
// passport setup
var passport = require('passport')
 , LocalStrategy = require('passport-local').Strategy,
   FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
	// console.log("type: " + user.type);
	if ( Object.keys(user).length < 7 ) {
	  db.Users.findOne({where: {id:user.id}}). then(function(user) {
	    done(null, user);
	  });
	} else {
		db.Business.findOne({where: {id:user.id}}). then(function(user) {
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
      db.Users.findOne({where: {'email' : email}}).then(function( user) {
        // In case of any error return
        if (user) {
          return done(null, false,
             req.flash('message','User Already Exists'));
        } else {
         	db.Users.create(req.body).then(function(dbUser) {
            	if (err){
            	  console.log('Error in Saving user: '+err);
            	}
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
    // check in mongo if a user with username exists or not
    db.Users.findOne({where: {
    	'email': username}
    }).
      then(function(user) {
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
    // check in mongo if a user with username exists or not
    db.Business.findOne({where: {
    	'email': username}
    }).
      then(function(user) {
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


	//  adds new user to database
	router.post("/user", passport.authenticate(
		'local-signup', {
			successRedirect: '/',
    		failureRedirect: '/user/new',
    		failureFlash : true
		}
	));


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
		// looks in database for all deals with that category
		db.Deals.findAll({
			where: {
				category: category
			},
			include: [db.Business]
		}).then(function(results){
			returnObject.deals = results
			// console.log("category: " + category);
			// object for looop cheks time and day if both pass marks as active else incative
			for (key in returnObject.deals) {
				// deals info: start time, end time , and days available
				var startTime = returnObject.deals[key].dealStart;
				var endTime = returnObject.deals[key].dealEnd;
				var days = returnObject.deals[key].daysAvailable;
				// runs time chek function if pass deal is active
				 if (helpers.timeCheck(startTime, endTime, days)) {
				 	console.log("mark card as active: " + key );
				 	returnObject.deals[key].active = "active"

				 } else {
				 	console.log("mark card as inactive");
					returnObject.deals[key].active = "pending";
				 }
			};

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
				query[key] = req.query[key].toString();
			}
		}
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
		 res.render("newBusiness",  {layout: "businessPage.handlebars"})
	});

	// route that displays new deal page
	router.get("/business/new-deal", function(req,res) {
		if (businessSignedIn) {
			db.Business.findOne({
				where: {
					id: bsignedIn_Id
				}
			}).then(function(results) {
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
