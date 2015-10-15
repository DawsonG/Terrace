var App = React.createClass({
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

module.exports = App;