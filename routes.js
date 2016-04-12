module.exports = function(app) {
  var AM = require('./libs/account-manager');
  var controller = require('./libs/controller.js');
  var api = require('./api/api_base.js');
  //var expressHbs = require('express-handlebars');

  var validateUser = function(req) {
    if (!req.session || !req.session.user){
			return false;
		}
		
    return true;
  };
  
  var isPublicAsset = function(file) {
    if (file.indexOf('css/') == 0 || file.indexOf('js/') == 0) {
      return true;
    }
    
    return false;
  };

  // ---- API Endpoints ----
  app.all('/api/:controller/:action', api);

  // ---- INSTALL process ----
  app.route('/install')
    .get(function(req, res) {
      res.sendFile(__dirname + '/admin/install.html');
    })
    .post(function(req, res) {
      var fields = req.body;
      
      req.db.collection('site').insert({
        name  : fields['site-name'],
        theme : 'default'
      }, {safe:true}, function(err, site) {
        if (err) { 
          console.log("Problem finding site.  Database connectivity?");
          console.log(err);
          
        }
        
        app.use(function(req, res, next) {
          req.site = site;
          next();
        });
        
        AM.addNewAccount({ email: fields['email'], password: fields['password'] }, req.db, function(err, result) {
          if (err) {
            console.log("Problem adding new account.");
            console.log(err);
            return;  
          }
          
          AM.autoLogin(fields['email'], result.ops[0].password, req.db, function(user){
    			  if (user) {
    			    req.session.user = user;
    				  return res.redirect('/admin');
    			  }
    			  
    			  return res.redirect("/admin/login");
    			});
              
        });
      });
  });

  // ---- ADMIN Endpoints ----
  app.route('/admin/login')
    .get(function(req, res) {
      if (validateUser(req)) {
        return res.redirect('/admin');
      }
      
      if (req.cookies.user == undefined || req.cookies.pass == undefined) {
        return res.sendFile(__dirname + "/admin/login.html");
      } else {
        AM.autoLogin(req.cookies.user, req.cookies.pass, req.db, function(user){
  			  if (user) {
  			    req.session.user = user;
  				  return res.redirect('/admin');
  			  }
  			  
  			  return res.sendFile(__dirname + "/admin/login.html");
  			});
      }
      
    })
    .post(function(req, res) {
      AM.manualLogin(req.body['email'], req.body['password'], req.db, function(e, o){
  			if (!o){
  				res.status(400).send(e);
  			}	else{
  				req.session.user = o;
  				//if (req.body['remember-me'] == 'true'){
  					res.cookie('user', o.user, { maxAge: 900000 });
  					res.cookie('pass', o.pass, { maxAge: 900000 });
  				//}
  				return res.redirect('/admin');
  			}
  		});
  });
  
  app.get('/admin*', function(req, res) {
    var file = req.params[0].replace(/^\/+|\/+$/g, '');
    var whitelist = ['content','media', 'settings', 'users'];
    if (!file || whitelist.indexOf(file) > -1) { 
      file = "index.html";
    }

    // Validate that the user is logged in.
    if (validateUser(req) || isPublicAsset(file)) {
      // Send whatever file is needed.
      res.sendFile(__dirname + "/admin/" + file);
    } else {
      res.redirect('/admin/login');
    }
  });

  // ---- Frontend ----
  app.get('/*', controller.index);
};