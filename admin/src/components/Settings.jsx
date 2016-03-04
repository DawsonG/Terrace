var React = require('react');

var Settings = React.createClass({
    getInitialState: function() {
        return {
            name: "",
            theme: "default",
            themes: ["default"],
            notice: "",
            posts: []
        };
    },
    
    componentDidMount: function() {
        this.serverRequest = $.get('/api/settings/index', function (result) {
            if (result) 
                this.setState(result);
        }.bind(this));
    },
    
    componentWillUnmount: function() {
      this.serverRequest.abort();  
    },
    
    handleThemeSelect: function(e) {
        this.setState({ theme: e.target.value });
    },
    
    handleHomePageSelect: function(e) {
        this.setState({ home_page: e.target.value });
    },
    
    handleSubmit: function(e) {
        e.preventDefault();
        var self = this;
        
        $.post('/api/settings/post', this.state, function(data) {
            if (data.success) {
                self.setState({ notice: "Settings Updated" });
            }
        });
    },
    
    render: function() {
        return (<div>
            <h1 className="ui left floated header">
              SETTINGS
            </h1>
            
            {this.state.notice}
            
            <form onSubmit={this.handleSubmit} className="ui form">
                <div className="required field">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" value={this.state.name} placeholder="Site Title or Name" />
                </div>
                
                <div className="required field">
                    <label htmlFor="theme">Home Page</label>
                    <select value={this.state.home_page} onChange={this.handleHomePageSelect} className="ui dropdown">
                        {this.state.posts.map(function(post) {
                           return (<option key={post._id} value={post._id}>{post.title} ({post.slug})</option>) 
                        })}
                    </select>
                </div>
                
                <div className="required field">
                    <label htmlFor="theme">Theme</label>
                    <select value={this.state.theme} onChange={this.handleThemeSelect} className="ui dropdown">
                        {this.state.themes.map(function(theme) {
                           return (<option key={theme} value={theme}>{theme}</option>) 
                        })}
                    </select>
                </div>
                
                <button className="ui primary button" type="submit">Submit</button>
            </form>
        </div>);
    } 
});

module.exports = Settings;