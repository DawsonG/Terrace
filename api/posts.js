var Post = require('../models/post');

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
  
  Post.find({}, 'slug', function(err, slugs) {
    if (err)
      return res.send(err);
      
    return res.json(slugs);
  });
};

function returnUniqueFromArray(field, cb) {
  Post.find({}, field, function(err, results) {
    if (err)
      return cb(err);
    
    var rtn = [];
    if (results && results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < results[i][field].length; j++) {
          var item = results[i][field][j];
          
          if (rtn.indexOf(item) == -1)
            rtn.push(item);
        }
      }
    }
    
    return cb(null, rtn);
  });
}

exports.getTags = function(req, res) {
  returnUniqueFromArray('tags', function(err, results) {
    if (err) throw err;
    
    return res.json(results);
  });
};

exports.getCategories = function(req, res) {
  returnUniqueFromArray('categories', function(err, results) {
    if (err) throw err;
    
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
  post.save(function() {
    return res.json({ success: true, post: post });
  });
};

exports.update = function(req, res) {
  if (!req.session.user)
    return res.status(403).send();
  
  Post.findById(req.body._id, function(err, post) {
    if (err) throw err;
    
    if (!post) {
      return res.json({ success: false });
    }
    
    post.title = req.body.title;
    post.content = req.body.content;
    post.excerpt = req.body.excerpt;
    post.save(function(err) {
      if (err) throw err;      
      
      return res.json({ success: true, post: post });
    });
  });
};