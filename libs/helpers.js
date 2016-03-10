var Post = require("../models/post");

// add any global theme helpers you need here
exports.stripHtml = function(html) {
  if (!html) return "";
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

  return html.replace(tags, '');
};

exports.ifCond = function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
};
