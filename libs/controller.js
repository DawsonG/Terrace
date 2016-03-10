var expressHbs = require('express-handlebars');
var fs = require("fs-extra");
var Post = require("../models/post");

function fileExists(path) {
  try  {
    return fs.statSync(path).isFile();
  }
  catch (e) {

    if (e.code == 'ENOENT') { // no such file or directory. File really does not exist
      console.log("File does not exist.");
      return false;
    }

    console.log("Exception fs.statSync (" + path + "): " + e);
    throw e; // something else went wrong, we don't have rights, ...
  }
}



exports.index = function(req, res) {
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

  var hbsfile = pathFix("index.hbs");
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
    
  Post.findLivePage(post_slug, function(err, post) {
    if (err) {
      return console.log(err);
    }
    
    if (!post) {
      // check if the file exists anywhere.
      if (fileExists(pathFix(post_slug))) {
        return res.sendFile(pathFix(post_slug));
      } else if (fileExists(pathFix(post_slug + ".hbs"))) {
        hbsfile = pathFix(post_slug + ".hbs");
        post = { content_type: "" };
      } else {
        return res.status(404).send("404, page not found.");
      }
    }
     
    if (post.content_type == "image") { //check the media library
      return res.sendFile(process.cwd() + '/content/' + post.additional.url);
    }
    
    hbs.getPartials().then(function(partials) {
      var template = hbs.handlebars.compile(post.content);
      
      Post.find({ content_type: "image", status: "live" }, function(err, results) {
        if (err) throw err;
        
        var viewOpts = {
          layout: path.theme + '/default.hbs',
          site: req.site,
          post: post,
          rendered_content: template({ site: req.site, post: post, images: results }, { helpers: hbs.helpers, partials:partials })
        };
        
        hbs.renderView(hbsfile, viewOpts, function(err, result) {
          if (err) {
            console.log(err);
            return res.status(500).send("looks like a theme problem");
          }
      
          res.write(result);
          res.end();
        });
      });
    });
  });
};

exports.contact = function(req, res) {
  var nodemailer = require('nodemailer');

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({ 
    host: 'oxmail2.registrar-servers.com',
    port: 587,
    secure: true, // use SSL
    auth: {
        user: 'admin@austinrkesler.design',
        pass: 'Ark71991'
    }
  });//587, 465
  
  transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
  });
  
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: '"AustinRKesler.design" <admin@austinrkesler.design>', // sender address
      to: 'info@austinrkesler.design', // list of receivers
      subject: 'Website Contact Form', // Subject line
      text: JSON.stringify(req.body), // plaintext body
      html: '<b>Subject:</b> ' +  req.body.subject + '<br/><b>Message:</b> ' + req.body.message + '<br/><b>Name:</b> ' + req.body.name + '<br/><b>Email:</b> <a href="mailto:' + req.body.email + '>' + req.body.email + '</a>' // html body
  };
  

  
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      
      console.log('Message sent: ' + info.response);
      return res.redirect('/contact?message=worked');
  });
};