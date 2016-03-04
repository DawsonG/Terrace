var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SiteSchema = new Schema({
    name: String,
    theme: { type: String, required: true, default: "default" },
    home_page: { type: String, required: true, default: "index" }
}, {collection: 'site'});

module.exports = mongoose.model("Site", SiteSchema);