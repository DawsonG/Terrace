exports.index = function(req, res) {
  var expressHbs = require('express-handlebars');
  
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
  
  function getExtension(filename) {
    return filename.split('.').pop();
  }

  
  var file = req.params[0];
  if (!file)
    file = "index.hbs";
    
  if (file.indexOf('/uploads/') > -1) // not a special file
    file = base + "/content" + file;
  else
    file = pathFix(file);

  if (getExtension(file) == "hbs") {
    var hbs = expressHbs.create({
      partialsDir: pathFix("partials"),
      helpers: require('../libs/helpers.js'),
      extname: ".hbs"
    });
    hbs.renderView(file, { 
      layout: path.theme + '/default.hbs',
  
      // DATA PASSED
      posts: [{ name: "test", content: "test content, test content, test content", author_name: "Ima Tester", publish_date: "2015/10/13 16:52:04" }],
      tags: [{ name: "test tag"}]    
    }, function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).send("looks like a theme problem");
      }
  
      res.write(result);
      res.end();
    });
  } else {
    res.sendFile(file);
  }
};

