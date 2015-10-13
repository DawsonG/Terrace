exports.index = function(req, res) {
  var hbs = require('express-hbs');
  var viewsDir = process.cwd() + "/content/themes/" + req.site.theme;

  res.app.engine('hbs', hbs.express4({
    partialsDir: process.cwd() + "/content/themes/" + req.site.theme + "/partials",
    viewsDir: viewsDir
  }));
  res.app.set('view engine', 'hbs');
  res.app.set('views', viewsDir);

  /*
  handlebars.renderTemplate(process.cwd() + "/content/themes/" + req.site.theme + '/default.hbs', {}, process.cwd() + "/content/themes/" + req.site.theme + '/index.hbs', function(err, result) {
    if (err) {
      return res.status(500);
    }

    console.log(result);
    res.write(result);
    res.end();
  });
  */

/*
  var promise = new Promise(function(resolve, reject) {
    req.db.collection('site').findOne({}, function(err, site) {
      if (err || !site)
        reject();

      resolve(site);
    });
  });

  promise.then(function(site) {
    handlebars.partialsDir = __dirname + "/content/themes/" + site.theme + "/partials";
    console.log(handlebars);
  });
*/

  return res.render('index');
  //
};

