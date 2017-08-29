var express = require("express");
var bodyParser = require("body-parser");
var override = require("method-override");
var bodyParser = require("body-parser");
var mrHandle = require("express-handlebars");
var routes = require("./controller/decide.js")



// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
// require("./routes/html-routes.js")(app);
// require("./routes/author-api-routes.js")(app);
require("./routes/post-routes.js")(app);

app.engine("handlebars", mrHandle({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use("/",routes)

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});


