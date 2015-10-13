/* =========================================================== */
/* Terrace - A lightweight extensible blogging platform build
 * in Node.js with layers!
 * 
 * The MIT License (MIT)
 *
 * http://github.com/DawsonG/Terrace
 *
 * =========================================================== */

var express        = require('express');  
var app            = express();

var MongoClient    = require('mongodb').MongoClient;
var settings       = require('./settings.json');

var port = process.env.PORT || 4200;
app.set('port', port);

// Open Mongoose
MongoClient.connect(settings.DATABASE_URL, function(err, db) {
  if (err) {
    console.log('No mongo database connection can be found.  Please check the DATABASE_URL of settings.json');
  } else {
    console.log("database connection open");
    
    db.collection("site").findOne({}, function(err, site) {
      var attachDB = function(req, res, next) {
        req.db = db;
        next();
      };

      var attachSite = function(req, res, next) {
        req.site = site;
        next();
      };

      app.use(attachDB); // attachDB is called before each request and allows us to get the database from the request object
      app.use(attachSite); // attachSite is called before each request so we can get the base site information
      require('./routes')(app);

      app.listen(port, function() {
        console.log('Server started: http://localhost:' + app.get('port') + '/');
      });
    });
  }
});

// expose app
exports = module.exports = app;