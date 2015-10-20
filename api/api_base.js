var fs = require('fs');

module.exports = function(req, res, next) {
  var controller;

  var baseDir = process.cwd() + '/api/';
  var controllerName = req.params.controller;
  var actionName = req.params.action;

  // Find the controller, make sure it exists, and get it
  if (fs.existsSync(baseDir + controllerName + '.js')) {
    controller = require(baseDir + controllerName);
  } else {
    console.log("INVALID CONTROLLER PATH");
    console.log('LOOKING FOR PROCESSED - ' + baseDir + controllerName + '.js');
    return res.status(404).send('Not found');
  }

  var fn = controller[actionName];

  if (typeof fn === 'function') {
    // Call the function making sure the 'this' context is the controller
    fn.call(controller, req, res); // Don't forget to pass our parameters and query string
  } else {
    console.log("INVALID CONTROLLER ACTION");
    console.log(controllerName + '[' + actionName + ']');
    return res.status(404).send('Not found');
  }
};