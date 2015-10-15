module.exports = function(app) {
  var controller = require('./libs/controller.js');
  var api = require('./api/api_base.js');
  
  var validateUser = function() {
    return true;
  };

  // ---- API Endpoints ----
  app.get('/api/:controller/:action', api);

  // ---- ADMIN Endpoints ----
  // Cheryl edit here! V V V
  app.get('/admin*', function(req, res) {
    var file = req.params[0];
    if (!file) {
      file = "index.html";
    }

    // Validate that the user is logged in.
    if (validateUser()) {
      // Send whatever file is needed.
      res.sendFile(__dirname + "/admin/dist/" + file);
    } else {
      res.status(420).send("Forbidden");
    }
  });

  // ---- Frontend ----
  app.get('/*', controller.index);
};