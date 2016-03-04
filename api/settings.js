var fs = require('fs-extra');
var Post = require("../models/post");
var Site = require("../models/site");

exports.index = function(req, res) {
    if (!req.session.user)
        return res.status(403).send();
    
    var rtn = req.site;
    rtn.themes = [];
    fs.readdirSync(process.cwd() + '/content/themes').forEach(function(name) {
        rtn.themes.push(name);
    });
    
    rtn.posts = [];
    Post.find({}, "_id title slug", function(err, results) {
        if (err) throw err;
        
        rtn.posts = results;
        return res.json(rtn);
    });
};

exports.post = function(req, res) {
    Site.findById(req.site._id, function(err, site) {
        if (err) throw err;
        
        site.name = req.body.name;
        site.theme = req.body.theme;
        
        site.save(function() {
            return res.json({ success: true });
        });
    });
};

exports.getSite = function(req, res) {
    
};