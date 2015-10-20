exports.getById = function(req, res) {
  res.json({});
};

exports.getOne = function(req, res) {
  req.json({});
  //req.db.collection('posts').findOne( , function(err, result) {
  //  if (err) res.send(err);
  //  res.json(result)
  //});
};