
var db = require("../models");
var express = require("express");

// var path = require("path");
// var app = express.Router();


// module.exports  = function(app) {
var router = express.Router();
// ==========customer/user routes==============
	// express router for main user page
	router.get("/:userId?", function(req, res) {
		var DecodedId = (req.params.userId /9) -173;
		var userName = "";
		console.log(DecodedId)
	
		if (DecodedId) {
			db.Users.findOne({
			where: {
				id: DecodedId
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
	router.get("/deals/:category/:userID?", function(req, res) {
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
			console.log("category: " + category)
			// console.log("results" + JSON.stringify(results));
			returnObject.deals = results;

			
			// res.render("deals", returnObject)
			if (userId>1) {
				var DecodedId = (userId /9) -173;

				db.Users.findOne({
					where: {
						id: DecodedId
					}
				}).then(function(results) {
					returnObject.userInfo = results;
					console.log("return object with users:   " + JSON.stringify(returnObject))
					// needs work not working properly
					res.render("deals", {returnObject, layout: 'loggedIn.handlebars' });
				})
			
			} else {
				console.log("deals: ======= " + JSON.stringify(results));
				console.log("return object:   " + JSON.stringify(returnObject));
				res.render("deals", returnObject);
			}
		});

		

		
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

	// express route for user sign in
	router.get("/signIn/:database", function(req, res) {
		var database = req.params.database;
		if (database === "user") {
			console.log("sign in user");
			res.render("signIn", {database: "Users"})
		} else if (database === "business") {
			console.log("business sign In")
			res.render("signIn", {datase: "Business"})
		}
	});
	

	
	// bussiness side routes
	// route for new business profile page
	router.get("/business/new", function(req, res) {
		console.log("get working")
		 res.render("newBusiness")	 
	});
	// route for main business page
	router.get("/business/:id", function(req, res) {
		var businessId = req.params.id
		db.Business.findOne({
			where: {
				id: businessId
			}
		}).then(function(results) {
			console.log("business main working:  " + results);
			res.render("bMain",results)
		})
		
	});
	// route that displays new deal page
	router.get("/new-deal/:businessId", function(req,res) {
		var businessId = req.params.businessId;
		db.Business.findOne({
			where: {
				id: businessId
			}
		}).then(function(results) {
			console.log("bussiness results: " + results)
			res.render("newDeal", results)
		});
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