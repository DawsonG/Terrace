var Post = require('../models/post');
var Classifier = require('../models/classifier');

exports.getById = function(req, res) {
  Post.findOne(req.query.id, function(err, result) {
    if (err)
      return res.send(err);
    
    return res.json(result);
  });
};

exports.getSlugs = function(req, res) {
  if (!req.session.user)
    return res.status(403).send();
  
  Post.find(null, 'slug', function(err, slugs) {
    if (err)
      return res.send(err);
      
    return res.json(slugs);
  });
};

exports.getClassifiers = function(req, res) {
  Classifier.find({ classifier_type: req.query.field }, function(err, results) {
    if (err)
      return res.send(err);
    
    return res.json(results);
  });
};

exports.getOne = function(req, res) {
  Post.findOne(req.query.query, function(err, result) {
    if (err)
      return res.send(err);
      
    return res.json(result);
  });
};

exports.getAll = function(req, res) {
  Post.find(req.body.query, function(err, results) {
    if (err) 
      return res.send(err);
      
    return res.json(results);
  });
};

exports.getPagesAndPosts = function(req, res) {
  Post.find({ content_type: { $in: ["page", "post" ]}}, function(err, results) {
    if (err)
      return res.send(err);
      
    return res.json(results);
  });
};

exports.create = function(req, res) {
  if (!req.session.user)
    return res.status(403).send();

  var post = new Post(req.body);
  post.status = "live"; // jury rig this for now
  post.save(function(err) {
    if (err)
      return res.json({ success: false, error: err });
    
    return res.json({ success: true, post: post });
  });
};

exports.update = function(req, res) {
  if (!req.session.user)
    return res.status(403).send();
  
  Post.findById(req.body._id, function(err, post) {
    if (err) {
      return res.json({ success: false, error: err });
    }
    
    if (!post) {
      return res.json({ success: false, message: "Post not found." });
    }
    
    post.title = req.body.title;
    post.content = req.body.content;
    post.excerpt = req.body.excerpt;
    post.save(function(err) {
      if (err) {
        console.log("Problem saving post.");
        console.log(err);
      }      
      
      return res.json({ success: true, post: post });
    });
  });
};