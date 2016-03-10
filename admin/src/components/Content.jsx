var React = require('react');
var ContentEdit = require("./ContentEdit");

var ContentItem = React.createClass({
  getInitialState: function() {
    return { post: {} };
  },
  
  handleEdit: function() {
    this.props.onItemEdit(this.props.post);
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
            <a className="ui small primary button" onClick={this.handleEdit}>
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
    this.serverRequest = $.get('/api/posts/getPagesAndPosts', { 
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
    var self = this;
    
    return (<div className="ui divided items">
      {this.state.posts.map(function(post) {
          return <ContentItem key={post._id} post={post} onItemEdit={self.props.onItemEdit} />;
      })}
    </div>);
  }
});

var Content = React.createClass({
  getInitialState: function() {
    return { page: "ContentList", post: null, categories: [] };
  },
  
  componentDidMount: function() {
    this.serverRequest = $.get('/api/posts/getClassifiers', { classifier_type: "category" }, function (results) {
      if (results) 
        this.setState({ categories: results });
    }.bind(this));
  },
  
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  
  clickNewPost: function() {
    this.setState({ page: "ContentEdit", post: null, content_type: "post" });
  },
  
  clickNewPage: function() {
    this.setState({ page: "ContentEdit", post: null, content_type: "page" });
  },
  
  handleItemEdit: function(e) {
    this.setState({ page: "ContentEdit", post: e._id });
  },
  
  redirectList: function() {
    this.setState({ page: 'ContentList' });
  },
  
  render: function() {
    var contextMenu = null;
    var page = null;
    switch(this.state.page) {
      case "ContentList":
        page = <ContentList onItemEdit={this.handleItemEdit} />;
        contextMenu = (
            <div style={{ width: '300px' }} className="right floated two ui small buttons">
              <button onClick={this.clickNewPost} className="ui primary button">
                <i className="plus icon"></i> New Post
              </button>
              <button onClick={this.clickNewPage} className="ui primary button">
                <i className="plus icon"></i> New Page
              </button>
            </div>
        );
        break;
      case "ContentEdit":
        page = <ContentEdit postId={this.state.post} contentType={this.state.content_type} redirectList={this.redirectList} />;
        break;
    }
    
    return (
      <div>
        <h1 className="ui left floated header">
          CONTENT
        </h1>
        {contextMenu}
      
        <div className="ui clearing divider"></div>
        
        {page}
      </div>
    );
  }
});

module.exports = Content;