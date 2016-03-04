exports.index = function(req, res) {
  var expressHbs = require('express-handlebars');
  var Post = require("../models/post");
  
  if (!req.site)
    return res.redirect('/install');
  
  var base = process.cwd();
  var path = {
    base  : base, // the root of the application
    theme : base + "/content/themes/" + req.site.theme
  };

  function pathFix(file) {
    return path.theme + '/' + file;
  }

  var file = req.params[0];
  var post_slug = req.params[0];

  if (!post_slug)
    post_slug = req.site.home_page || "index";

  if (post_slug.indexOf('uploads/') == 0) {
    return res.sendFile(process.cwd() + '/content/' + post_slug);
  }

  var hbs = expressHbs.create({
    partialsDir: pathFix("partials"),
    helpers: require('../libs/helpers.js'),
    extname: ".hbs"
  });
    
  Post.findLivePage(post_slug, function(err, result) {
    if (err) throw err;
    
    if (!result) {
      // call user a bitch
      return res.status(404).send("404, page not found.");
    }
     
    if (result.content_type == "image") { //check the media library
      return res.sendFile(process.cwd() + '/content/' + result.additional.url);
    }
    
    var viewOpts = {
      layout: path.theme + '/default.hbs',
      site: req.site,
      post: result
    };
    
    hbs.renderView(pathFix('index.hbs'), viewOpts, function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).send("looks like a theme problem");
      }
  
      res.write(result);
      res.end();
    });
  });
};
