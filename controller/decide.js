
var db = require("../models");
var express = require("express");
var Yelp = require("../APIs/yelpAPI.js");


// var path = require("path");
// var app = express.Router();


// module.exports  = function(app) {
var router = express.Router();
// ==========customer/user routes==============
var signedIn = false;
var signedIn_Id;
var businessSignedIn = false;
var bsignedIn_Id;

	// route to about page 
	router.get("/about", function(req,res) {
		res.render("about");
	});
	// express router for main user page
	router.get("/:userId?", function(req, res) {
		userID = req.params.userId;
		var DecodedId = (req.params.userId /9) -173;
		var userId = DecodedId;
		console.log(DecodedId);
		if (DecodedId>0) {
			signedIn= true;
			signedIn_Id = DecodedId;
		}
	
		if (signedIn) {
			db.Users.findOne({
			where: {
				id: signedIn_Id
			}
		}).then(function(results) {
			userName = results.userName;
			console.log("name: " + results.userName);
			console.log("individual working");
			res.render("index", {layout: 'loggedIn.handlebars', userName: userName} );
		})
		} else {
			console.log("main page working");
			res.render("index");
		}	
	});

	// express router for deals page
	router.get("/deals/:category/", function(req, res) {
		var category = req.params.category;
		
		var returnObject ={};
		var userId = req.params.userID;
		console.log(userId);
		console.log("category: " + category)
		// looks in database for all deals with that category
		db.Deals.findAll({
			where: {
				category: category
			}, 
			include: [db.Business]
		}).then(function(results){

			// console.log("results" + JSON.stringify(results));
			returnObject.deals = results

			console.log("category: " + category);

			for (key in returnObject.deals) {
				var startTime = returnObject.deals[key].dealStart;
				console.log("dealStart:======" + startTime)
				var endTime = returnObject.deals[key].dealEnd;
				console.log(startTime + "-" + endTime);
				
				 if (timeCheck(startTime, endTime)) {
				 	console.log("mark card as active");
				 	returnObject.deals[key].active = "active"

				 } else {
				 	console.log("mark card as inactive");
					returnObject.deals[key].active = "pending";
				 }
			};	 


			// function that checks the results to see if they're active
			function timeCheck(dealStart, dealEnd) {
				var currentTime = new Date();
				var hour = parseInt(currentTime.getHours());
				var minute = parseInt(currentTime.getMinutes());
				if (minute<10) {
					minute= "0" + String(minute)
				}
				var timeN = parseInt(String(hour) + String(minute));
				console.log("current hour" + hour)

				var splitStart = dealStart.split(":");
				var splitEnd =dealEnd.split(":");
				var start = parseInt(splitStart[0] + splitStart[1]);
				var end = parseInt(splitEnd[0] + splitEnd[1]);
				var currentTime = parseInt(hour + minute);
				console.log("final startTime" + start);
				console.log("final end time: " + end);
				console.log("final Time: " + timeN);
				console.log("startTime: "+ dealStart + "dealEnd" + dealEnd);

				if ((start < timeN) && (timeN < end)) {
					console.log("deal is active");
					return true;

				} else {
					console.log("deal is inactive")
					return false;
				}
				
			}
			

			
			// res.render("deals", returnObject)
			if (signedIn) {
				var DecodedId = (userId /9) -173;

				db.Users.findOne({
					where: {
						id: signedIn_Id
					}
				}).then(function(results) {
					returnObject.userInfo = results;
					console.log("active---:  " + returnObject.deals[0].active);
					console.log("return object with users:   " + JSON.stringify(returnObject))
					// needs work not working properly
					if(category== "food") {
						res.render("deals", {deals: returnObject.deals, layout: 'loggedIn.handlebars' });
					} else {
						res.render("funDeals", {deals: returnObject.deals, layout: 'loggedIn.handlebars' });
					}
				})
			
			} else {

				console.log("active??:  " + returnObject.deals[0].active)
				console.log("return object with users:   " + JSON.stringify(returnObject))
				console.log("deals: ======= " + JSON.stringify(results));
				console.log("return object:   " + JSON.stringify(returnObject));
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
		console.log("searchworking");
		var category = req.params.category;
		var obj = {location: " denver, co"};
		Yelp.apiCall(obj, function (data) {
			console.log("yelp data: " + data)
			if (signedIn) {
				if (category=="food") {
					res.render("search", {bInfo: data, layout:'loggedIn.handlebars'});
				} else {
					res.render("funSearch", {bInfo: data,layout:'loggedIn.handlebars'});
				}
			} else {
				if (category == "food") {
					res.render("search", {bInfo: data})
				} else {
					res.render("funSearch", {bInfo: data})
				}		
			}
		});
		// console.log(JSON.stringify(Yelp.apiCall(obj)))
	});

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


	
	// express route for businees user sign in	
	router.get("/business/index/:bsId?", function(req, res) {
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

		if (businessSignedIn) {	
			db.Business.findOne({
				where: {
					id: bsignedIn_Id
				}, include: [db.Deals]
			}).then(function(results) {
				console.log("business main working:  " + results);
				// console.log("contact person: " + results.contactName)
				returnObject.deals = results;
				console.log("business page deals: " + JSON.stringify(returnObject.deals.Deals));
				res.render("bMain", {deals: returnObject.deals, bId: results.id, businessUser: results.contactName, layout: "businessPage.handlebars"});
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