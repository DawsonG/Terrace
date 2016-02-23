var React = require('react');
var ReactQuill = require("react-quill");

var ContentEdit = React.createClass({
    getInitialState: function() {
        // return a blank post item
        return {
            title: "",
            excerpt: "",
            slug: ""
        };
    },
    
    handleSubmit: function() {
        
    },
    
    componentDidMount: function() {
        if (!this.props.postId)
            return; // We've probably created an all new page.
        
        this.serverRequest = $.get('/api/posts/getOne', { 
          query: { _id : this.props.postId }
        }, function (result) {
            if (result) 
                this.setState(result);
        }.bind(this));
    },
  
    componentWillUnmount: function() {
        this.serverRequest.abort();
    },
    
    render: function() {
        return (<form onSubmit={this.handleSubmit} className="ui form">
            <div className="required field">
                <label for="title">Title</label>
                <input id="title" name="title" type="text" placeholder="Title" />
                <span id="slug" className="muted">{this.state.slug}</span>
            </div>
            
            <div className="field">
                
            </div>
        </form>);
    }
});

module.exports = ContentEdit;