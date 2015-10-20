exports.getById = function(req, res) {
  req.db.collection('posts').findOne(req.body.id, function(err, result) {
    if (err) res.send(err);
    
    return res.json(result);
  });
};

exports.getOne = function(req, res) {
  req.db.collection('posts').findOne(req.body.query, function(err, result) {
    if (err) res.send(err);
    
    return res.json(result);
  });
};

exports.getAll = function(req, res) {
  req.db.collection('posts').find(req.body.query, function(err, results) {
    if (err) res.send(err);

    return res.json(results);
  });
};

exports.create = function(req, res) {
  req.db.collection('posts').insert(req.body.post, function(err, result) {
    if (err) res.send(err);

    return res.json({ success: true, post: result });
  })
};

exports.update = function(req, res) {
  
};