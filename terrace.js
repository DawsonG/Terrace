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
MongoClient.connect(settings.DATABASE_URL, function(err) {
  console.log("database connection open");

  require('./routes')(app);

  app.listen(port, function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
  });
});

// expose app
exports = module.exports = app;