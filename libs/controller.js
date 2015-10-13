exports.index = function(req, res) {
  var hbs = require('express-hbs');
  var handlebars = hbs.create();

  return res.status(404).send("Not found... yet.");
};

