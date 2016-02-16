module.exports = function(app) {
  var AM = require('./libs/account-manager');
  var controller = require('./libs/controller.js');
  var api = require('./api/api_base.js');

  var validateUser = function(req) {
    if (!req.session || !req.session.user){
			return false;
		}
		
    return true;
  };

  // ---- API Endpoints ----
  app.get('/api/:controller/:action', api);

  // ---- ADMIN Endpoints ----
  app.get('/admin/login', function(req, res) {
    if (validateUser(req)) {
      return res.redirect('/admin');
    }
    
    if (req.cookies.user == undefined || req.cookies.pass == undefined) {
      return res.sendFile(__dirname + "/admin/login.html");
    } else {
      AM.autoLogin(req.cookies.user, req.cookies.pass, req.db, function(user){
			  if (user){
			    req.session.user = user;
				  return res.redirect('/admin');
			  }
			  
			  return res.sendFile(__dirname + "/admin/login.html");
			});
    }
    
  });
  
  app.post('/admin/post', function(req, res) {
    AM.manualLogin(req.body['user'], req.body['pass'], req.db, function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.status(200).send(o);
			}
		});
  });
  
  app.get('/admin*', function(req, res) {
    var file = req.params[0];
    if (!file) {
      file = "index.html";
    }

    // Validate that the user is logged in.
    if (validateUser(req)) {
      // Send whatever file is needed.
      res.sendFile(__dirname + "/admin/" + file);
    } else {
      res.redirect('/admin/login');
    }
  });

  // ---- Frontend ----
  app.get('/*', controller.index);
};