// add any global theme helpers you need here
exports.stripHtml = function(html) {
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

  return html.replace(tags, '');
};