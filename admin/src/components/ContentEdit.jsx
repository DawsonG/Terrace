var React = require('react');
var brace = require('brace');
//var AceEditor = require("react-ace");

require('brace/mode/handlebars');
require("brace/theme/github");


function slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
}

var ContentEdit = React.createClass({
    getInitialState: function() {
        // return a blank post item
        return {
            title: "",
            content: "",
            excerpt: "",
            slug: ""
        };
    },
    
    handleContentChange: function(newValue) {
        this.setState({ content:newValue });  
    },
    
    handleExcerptChange: function(e) {
        this.setState({ excerpt: e.target.value });  
    },
    
    handleTitleChange: function(event) {
        var slug = slugify(event.target.value);
        
        this.setState({ title: event.target.value, slug: slug });
    },
    
    handleTitleBlur: function(event) {
        var self = this;
        var title = this.state.title;
        var slug = slugify(title);
        
        $.get('/api/posts/getSlugs', function(results) {
            var number = 0;
            while (results.indexOf(slug) > -1) {
                // The slug is not unique. Grab the number on the end
                var matches = slug.match(/\-(\d+)$/);
                if (matches) {
                    slug = slug.replace(matches[0], number);
                } else {
                   slug = slug + "-" + number; 
                }
                
                number++;
            }
            
           self.setState({ title: title, slug: slug });
        });
    },
    
    handleSubmit: function(e) {
        e.preventDefault();
        var self = this;
        
        this.state.content_type = this.props.content_type;
        
        if (this.props.postId) {
            $.post('/api/posts/update', this.state, function(data) {
                if (data.success) {
                    self.backToList();
                }
            }); 
        } else {
            $.post('/api/posts/create', this.state, function(data) {
                if (data.success) {
                    self.backToList();
                }
            });
        }
    },
    
    backToList: function() {
        this.props.redirectList();
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
        if (!this.props.postId)
            return;
        
        this.serverRequest.abort();
    },
    
    /*
    <AceEditor
        mode="handlebars"
        theme="github"
        name="content"
        height="400px"
        width="100%"
        value={this.state.content}
        onChange={this.handleContentChange}
     />
    */
    
    render: function() {
        return (<form onSubmit={this.handleSubmit} className="ui form">
            <div className="required field">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" type="text" value={this.state.title} onChange={this.handleTitleChange} onBlur={this.handleTitleBlur} placeholder="Title" />
                <span id="slug" className="muted">{this.state.slug}</span>
            </div>
            
            <div className="field">
                <label htmlFor="content">Content</label>
                
            </div>
            
            <div className="field">
                <label htmlFor="excerpt">Excerpt</label>
                <textarea id="excerpt" rows={3} value={this.state.excerpt} onChange={this.handleExcerptChange}></textarea> 
            </div>
            
            <button className="ui button" type="button" onClick={this.backToList}>Cancel</button>
            <button className="ui primary button" type="submit">Submit</button>
        </form>);
    }
});


/*
<ReactQuill
    theme="snow"
    value={this.state.content}
    onChange={this.handleContentChange}
/>
                
<SimpleEditor
    id="excerpt"
    name="excerpt"
    text={this.state.excerpt}
    onChange={this.handleExcerptChange}
/>
*/
module.exports = ContentEdit;