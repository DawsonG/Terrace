/*** Unofficial Post Schema Mockup ***/
/*  {
/*    title: "Whatever the title is",
/*    slug: "whatever-the-title-is",
/*    author_name: "Ima Author",
/*    status: "draft|archived|published",
/*    publish_date: new Date(),
/*    tags: [
/*      <tag_object>,
/*      <tag_object>
/*    ],
/*    content: {
/*      raw_type: "markdown|html",
/*      raw: "Raw content with editor markings, etc.",
/*      processed: "Ready for display!"
/*    },
/*    history: [
/*      {
/*        old: <content_object>,
/*        new: <content_object>,
/*        userId: "ObjectId",
/*        timestamp: new Date()
/*      }
/*    ]
/*  }                              ***/

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
  var cursor = req.db.collection('posts').find(req.body.query);
  var rtn = [];
  cursor.each(function(err, doc) {
    if (err) 
      return res.send(err);

    if (doc != null) {
      rtn.push(doc);
    } else {
      return res.json(rtn);
    }
  });
};

exports.create = function(req, res) {
  req.db.collection('posts').insertOne(req.body.post, function(err, result) {
    if (err) res.send(err);

    return res.json({ success: true, post: result });
  });
};

exports.update = function(req, res) {
  req.db.collection('posts').updateOne(req.body.query, req.body.updateCommand, function(err, result) {
    if (err) res.send(err);

    return res.json({ success: true, post: result });
  });
};