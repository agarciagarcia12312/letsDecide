var db = require("../models");
var yelp = require("../APIs/yelpAPI.js");

// const obj = {price:"1,2"}
// yelp.apiCall(obj);
module.exports = function(app) {
	// route that add user
	// cheks if username already exist-- needs work
	// app.post("/user", function(req, res) {
	// 	console.log("add user workin");

	// 	db.Users.create(req.body).then(function(dbResults) {
	// 		// var encodedID = (dbResults.id + 173) * 9;
	// 			res.redirect("/");
	// 			// res.json(dbUsers);
	// 	});
		
	// });

	// //  user sign in authenthication and redirect
	// app.post("/signIn", function(req,res) {
	// 	var passwordInput = req.body.password;
	// 	console.log("sign in post work");
	// 	console.log("sign in Request: " + JSON.stringify(req.body) );
	// 	db.Users.findOne({
	// 		where: {
	// 			email: req.body.email
	// 		}
	// 	}).then(function(results) {
	// 		console.log("search results" + JSON.stringify(results))
	// 		if (passwordInput === results.password) {
	// 			console.log("correct password");
	// 			var encodedID = (results.id + 173) * 9;
	// 			res.json()
	// 			// res.redirect("/"+ encodedID);
	// 		}

	// 	})
	// });

	// api post route that checks business sign in
	// app.post("/bSignIN", function(req, res) {
	// 	var passwordInput = req.body.password;
	// 	console.log("business sign in working");
	// 	db.Business.findOne({
	// 		where: {
	// 			email: req.body.email
	// 		}
	// 	}).then(function(results) {
	// 		if (passwordInput === results.password) {
	// 			console.log("correct password");
	// 			var encodedID = (results.id + 173) * 9;
	// 			res.redirect("/business/index/"+ encodedID);
	// 		}

	// 	})
	// })



	// route that updates user --- needs work
	app.put("/users", function(req, res) {
		console.log("update cupon working");

		db.Users.update({
			
		},{
			where: {

			}
		}).then(function(dbPost) {
			res.json(dbPost)
		});
	});


	// route that adds new bussines
	// cheks if username already exist --needs work
	// app.post("/business", function(req, res) {
	// 	console.log("add bussines workin");
	// 	db.Business.create(req.body).then(function(dbBusiness) {
	// 		var encodedID = (dbBusiness.id + 173) * 9;
	// 		res.redirect("/business/main");
	// 		// res.json(dbBusiness);
	// 	});
	// })

	// route that updates bussines
	app.put("/business", function(req, res) {
		console.log("update cupon working");

		db.Business.update({

		},{
			where: {

			}
		}).then(function(dbPost) {
			res.json(dbPost)
		});
	});

	// api call: gets all live cupons
	app.get("/api/deals", function(req, res) {
		db.Deals.findAll({}).then(function(dbDeals) {
			return res.json(dbDeals)
		})
	});
	// api call: gets all cupons for business
	app.get("/api/deals/:userId?", function(req, res) {
		db.Deals.findAll({
			where: {
				id:req.params.userId
			}
		}).then(function(dbFavorites) {
			return res.json(dbFavorites)
		})
	});

	// api call adds cupon -- need help
	app.post("/api/deals", function(req, res) {
		req.body.daysAvailable = req.body.daysAvailable.toString();
		console.log("add cupon body: " + JSON.stringify(req.body));
		db.Deals.create(req.body).then(function(dbDeals) {
			res.redirect("/business/main");
		});
	});

	// api call: delete cupon
	app.delete("/api/deals/:cuponId", function(req, res) {
		db.Deals.destroy({
			where: {
				id: req.params.cuponId
			}
		}).then(function(dbDeals) {
			res.redirect("/business/main")
			// res.json(dbDeals)
		})
	});
	// api call: gets all favorites for user
	app.get("/api/favorites/:userId", function(req, res) {
		db.Favorites.findAll({
			where: {
				id:req.params.userId
			}
		}).then(function(dbFavorites) {
			return res.json(dbFavorites)
		})
	});
	// api call: adds to favorite list
	app.post("/api/favorites", function(req, res) {
		console.log("add favorites route working")
		db.Favorites.create(req.body).then(function(dbFavorites) {
			res.redirect("back");
		});
	});
	// api call:deletes from favorite list
	app.delete("/api/favorites/:favId", function(req, res) {
		db.Favorites.destroy({
			where: {
				id: req.params.favId
			}
		}).then(function(dbFavorites) {
			res.redirect("back");
		})
	});







}