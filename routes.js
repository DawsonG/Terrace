module.exports = function(app) {
  // These will need to be passed off to controllers

  app.get('/', function(req, res) {

  });

  app.get('/admin', function(req, res) {
    // Validate that the user is logged in.

    // Send the default file.
    res.sendFile(__dirname + "/admin/dist/index.html");
  });

  app.get('/admin/*', function(req, res) {
    // Validate that we are logged in.

    // Send whatever file is needed.
    res.sendFile(__dirname + "/admin/dist/" + req.params[0]);
  });
};