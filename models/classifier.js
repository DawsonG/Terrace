var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClassifierSchema = Schema({
    name: { type: String, required: true, unique: true },
    classifier_type: { type: String, default: "tag" }
});

module.exports = mongoose.model("Classifier", ClassifierSchema);