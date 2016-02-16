var React = require('react');

var Content = React.createClass({
  displayName: "",
  getInitialState: function() {
    return require('../models/post');
  },
  
  componentDidMount: function() {
    this.serverRequest = $.get('/api/posts/getOne', { 
      query: { record : this.props.pageId }
    }, function (result) {
      if (result)
        this.setState(result)
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  
  render: function() {
    return (
      <div>
        Content
        {this.state.title} - {this.state.slug}<br/>
        {this.state.content}
      </div>
    );
  }
});

module.exports = Content;