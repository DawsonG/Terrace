var fs = require('fs-extra');
var lwip = require("lwip");
var formidable = require("formidable");
var async = require("async");

var Post = require("../models/post");

function getExtension(filename) {
	return filename.split('.').pop();
}

exports.index = function(req, res) {
	if (!req.session.user)
        return res.status(403).send();
        
    Post.find({ content_type: { $in: ["image", "video", "file"] }}, function(err, results) {
    	if (err) throw err;
    	
    	return res.json(results);
    });
};

exports.multiupload = function(req, res) {
    if (!req.session.user)
        return res.status(403).send();
    
    var form = new formidable.IncomingForm();
    var fields = null;
	form.parse(req, function(err, f, files) {
	    if (err) throw err;
	    
		fields = f;
	});

	form.on('end', function() {
		var path = process.cwd() + '/content/uploads/';
		
		//imageVersions will need to come from site settings... or perhaps theme settings at some point.
		var imageVersions = [
			{
				name : "large",
				width : 600,
				height : 600
			},
			{
				name : "medium",
				width : 300,
				height : 300
			},
			{
				name : "small",
				width : 200,
				height : 200
			},
			{
				name: "thumbnail",
				width : 60,
				height : 60
			}
		];
		
		var new_posts = [];
		
		// loop through the incoming files
		async.eachSeries(form.openedFiles, function(file, callback) {
		    Post.getUniqueSlug(file.name.split('.')[0], function(slug) {
		    	var temp_path = file.path;
		    	var extension = getExtension(file.name);    
		    	var file_name = slug + '.' + extension;
		    	
		    	// copy the file from tmp to its final destination
		    	fs.copySync(temp_path, path + file_name);
		    
			    //pop open the file with lwip and resize
	    		lwip.open(path + file_name, function(err, image) {
	    		    if (err) {
	    		    	console.log(err);
	    		    }
	    		    
	    			async.eachSeries(imageVersions, function(iv, version_callback) {
	    				image.resize(iv.width, iv.height, function(err, image) {
	    					if (err) return callback(err);
	    
	    					fs.ensureDirSync(path + iv.name);
	    					
							image.writeFile(path + iv.name + "/" + file_name, function(err) {
								if (err) {
									console.log(err);
								}
								
								return version_callback();
	    					});
	    				});
	    			}, function(err) {
	    				if (err) {
    						console.log(err);
    					}
	    					
	    				
	    				Post.create({
	 						title: file_name,
	 						status: 'live',
	    				    content_type: 'image',
	    				    additional: {
	    				    	file_name: slug + '.' + extension,
	    				    	url: '/uploads/' + slug + '.' + extension
	    		
	    				    }
	    				}, function(err, new_post) {
	    					if (err) {
	    						console.log(err);
	    					}
	    					
	    					new_posts.push(new_post);
	    					return callback();
	    				});
	    			});
	    		});
		    });
		}, function() {
			return res.json({ success: true, posts: new_posts });
		});
	});
};
