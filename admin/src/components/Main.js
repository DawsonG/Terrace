var React = require('react');
var ReactDOM = require('react-dom');

var Main = React.createClass({
  render: function() {
    $.get('/api/posts/getOne', {
      query: { record : 10 }
    }, function(data) {
      console.log(data);
    });

    return (
      <div>
        Hello World!
      </div>
    )
  }
});

module.exports = Main;