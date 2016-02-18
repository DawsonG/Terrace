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
var session        = require('express-session');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var http           = require('http');

var MongoClient    = require('mongodb').MongoClient;
var MongoStore     = require('connect-mongo')(session);
var settings       = require('./settings.json');

var app            = express();
var port = process.env.PORT || 4200;
app.set('port', port);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Open Mongoose
MongoClient.connect(settings.DATABASE_URL, function(err, db) {
  if (err) {
    console.log('No mongo database connection can be found.  Please check the DATABASE_URL of settings.json');
  } else {
    console.log("database connection open");
    
    app.use(session({
      	secret: settings.SECRET,
      	proxy: true,
      	resave: true,
      	saveUninitialized: true,
      	store: new MongoStore({ db: db })
    	})
    );
    
    var attachDB = function(req, res, next) {
      req.db = db;
      next();
    };

    var attachSite = function(req, res, next) {
      db.collection("site").findOne({}, function(err, site) {
        if (!site && req.originalUrl != "/install" && 
          req.originalUrl.indexOf('/css/') < 0 && req.originalUrl.indexOf('/js/') < 0) {
          return res.redirect('/install');
        }
        
        req.site = site;
        next();
      });
    };

    app.use(attachDB); // attachDB is called before each request and allows us to get the database from the request object
    app.use(attachSite);
    require('./routes')(app);

    var server = http.createServer(app).listen(port, function() {
      console.log('Express server listening on port ' + port);
    });
      
    if (settings.ENABLE_SOCKETS) { // sockets are used by the backend and are totally optional
      var io = require('socket.io').listen(server);
    }
  }
});

// expose app
exports = module.exports = app;