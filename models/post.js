var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CreatorSchema = {
	id : Schema.ObjectId,
	name : String,
	fname : String,
	lname : String,
	display : Boolean
};

var PostSchema = new Schema({
    slug      	 : { type: String, required: true, unique: true },
	title     	 : String, //title to display
	tags      	 : [String],
	category	 : String,
	content   	 : String,
	excerpt      : String,
	alias        : [String], // aliases are redirection slugs.
	content_type : { type: String, required: true, default: 'page', enum: ["page", "post", "image", "video", "file"] },
	additional   : Object,
	status    	 : { type: String, required: true, default: 'draft' }, //only content marked 'live' is reachable
	revision  	 : { type: Number, required: true, default: 0 }, //Let's keep old versions of things.  Zero is
															 //the default identifier meaning "current".
	entered   	 : { type: Date, default: Date.now },
	enteredBy 	 : CreatorSchema,
	revised   	 : Date,
	revisedBy 	 : CreatorSchema
});

PostSchema.statics.findLivePage = function(key, cb) {
	var objIdRegEx = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
	var query = {
		status : 'live'
	};
	
	if (objIdRegEx.test(key)) {
		query._id = key;
	} else {
		query.slug = key;
	}
	console.log(query);
	
	this.findOne(query, function(err, page) {
    	return cb(err, page);
    });
};

PostSchema.statics.getUniqueSlug = function(slug, cb) {
 	this.find(null, 'slug', function(err, results) {
		if (err) {
            return console.log(err);
        }
		  
		var number = 0;
		var slugs = [];
		for (var i = 0; i < results.length; i++) {
			slugs.push(results[i].slug);
		}
		
        while (slugs.indexOf(slug) > -1) {
            // The slug is not unique. Grab the number on the end
            var matches = slug.match(/\-(\d+)$/);
            if (matches) {
                slug = slug.replace(matches[0], "-" + number);
            } else {
               slug = slug + "-" + number; 
            }
            
            number++;
        }
        
        return cb(slug);
	});	
};

PostSchema.methods.getHistory = function(projection, cb) {
	var PageModel = this.model('Post');

	if (Object.prototype.toString.call(projection) == '[object Function]') {
		cb = projection;
		projection = "-renderedContent -rawContent";
	}

	PageModel.find({ key : this.key }).select(projection).sort("-revision").exec(function(err, results) {
		cb(err, results);
	});
};

PostSchema.methods.addRevision = function(user, cb) {
	//Revisions share a page's key, rawContent, and renderedContent
    //but have different status and revision number of course.
    var PageModel = this.model('Post');

    PageModel.findById(this.id, function(err, page) { 
        if (err) {
            return console.log(err);
        }
        
    	var x = page;

    	x.revised = new Date();
    	x.revisedBy = {
    		id : user._id,
			name : user.userName,
			fname: user.firstName,
			lname: user.lastName,
			display: true
    	};

    	PageModel.find({ 
    		key: page.key,
    		site: page.site
    	}).select("key revision status").sort("-revision").exec(function(err, results) {
    	    if (err) {
	            return console.log(err);
	        }
    	    
    		if (results) {
    			//Increment the revision number
    			x.revision = results[0].revision + 1;
    			//Set the previous records status to history.
    			x.status = "history";
    			//Important to ensure this is a new record created
    			x._id = null;
				PageModel.create(x, function(err) {
        			if (err) {
			            return console.log(err);
			        }

        			return cb();
        		});
    		}
    	});
	});
};

PostSchema.methods.switchRevision = function(revNumber) {
	//Take the current page, make it a revision, then set a particular revision number live
	console.log(this);
};

PostSchema.pre('validate', function(next) {
    var post = this;

    function slugify(text) {
	    return text.toString().toLowerCase()
	      .replace(/\s+/g, '-')        // Replace spaces with -
	      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
	      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
	      .replace(/^-+/, '')          // Trim - from start of text
	      .replace(/-+$/, '');         // Trim - from end of text
	}

	if (this.isNew) {
		this.model('Post').getUniqueSlug(slugify(post.title), function(slug) {
			post.slug = slug;
			
			return next();
		});
	} else {
		return next();
	}
});

module.exports = mongoose.model("Post", PostSchema);