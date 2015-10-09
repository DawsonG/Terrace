module.exports = function(app) {
  // These will need to be passed off to controllers

  app.get('/', function(req, res) {

  });

  app.get('/admin', function(req, res) {
    res.sendFile(__dirname + "/admin/index.html");
  });

  app.get('/tlibs/*', function(req, res) {
    // Validate that we are logged in.

    // Send whatever file is needed.
    res.sendFile(__dirname + "/admin/libs/" + req.params[0]);
  });
};