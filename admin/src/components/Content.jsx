var React = require('react');
var ContentEdit = require("./ContentEdit");

var ContentItem = React.createClass({
  getInitialState: function() {
    return { post: {} };
  },
  
  
  render: function() {
    var post = this.props.post;
    
    return (<div className="ui item">
      <div className="ui small image">
        <img src="/admin/images/placeholders/image.png" />
      </div>
      <div className="middle aligned content">
        <div className="header">{post.title}</div>
        <div className="meta">
          {post.author}
        </div>
        <div className="description">
          <p>{post.excerpt}</p>
        </div>
        <div className="extra">
          <div className="ui right floated">
            <a href={post.url} target="_blank" className="ui small default button">
              View
              <i className="right eye icon"></i>
            </a>
            <a className="ui small primary button">
              Edit
              <i className="right edit icon"></i>
            </a>
          </div>
          
          <div className="ui label">Tag 1</div>
          <div className="ui label">Tag 2</div>
          <div className="ui label">Tag 3</div>
          <div className="ui label">Tag 4</div>
        </div>
      </div>
    </div>);
  }
});

var ContentList = React.createClass({
  getInitialState: function() {
    return { posts: [] };
  },
  
  componentDidMount: function() {
    this.serverRequest = $.get('/api/posts/getAll', { 
      query: { record : this.props.pageId }
    }, function (results) {
      if (results) 
        this.setState({ posts: results });
    }.bind(this));
  },
  
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  
  render: function() {
    var content = [];
    
    return (<div className="ui divided items">
      {this.state.posts.map(function(post) {
          return <ContentItem key={post._id} post={post} />;
      })}
    </div>);
  }
});

var Content = React.createClass({
  getInitialState: function() {
    return { page: "ContentList" };
  },
  
  clickNewPage: function() {
    this.setState({ page: "ContentEdit" });
  },
  
  render: function() {
    var page = null;
    switch(this.state.page) {
      case "ContentList":
        page = <ContentList />;
        break;
      case "ContentEdit":
        page = <ContentEdit />;
        break;
    }
    
    return (
      <div>
        <h1 className="ui dividing header">
          CONTENT
          <a onClick={this.clickNewPage} className="ui right floated small primary button">
            <i className="plus icon"></i>
            New Page
          </a>
        </h1>
        {page}
      </div>
    );
  }
});

module.exports = Content;