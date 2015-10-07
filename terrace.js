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

var port = process.env.PORT || 4200;

//app.use(express.static(__dirname + '/public'));

require('./routes')(app);

app.listen(port, function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

// expose app
exports = module.exports = app;