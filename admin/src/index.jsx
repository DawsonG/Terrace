/** @jsx React.DOM */
'use strict';
var css = require("./scss/styles.scss");

var React = require('react');
var ReactDOM = require('react-dom');

// Main Pages
var Dashboard = require('./components/Dashboard');
var Content = require('./components/Content');

// Menu / Navigation
var Menu = require('./components/Menu');
var MenuItem = require('./components/MenuItem');

// The root of all our documents.
var App = React.createClass({
    getInitialState: function() {
        return { page: "Dashboard" };
    },
    
    handleClick: function(sender) {
        this.setState({ page: sender.props.name });
        sender.setState({ active: true });
    },
    
    render: function() {
        var page = <Dashboard />;
        switch (this.state.page) {
            case "Dashboard":
                page = <Dashboard />;
                break;
            case "Content":
                page = <Content />;
                break;
        }
        
        return (<div className="ui grid">
            <div className="three wide column">
                <Menu>
                    <MenuItem name="Dashboard" active={this.state.page == "Dashboard" ? true : false} label="0" onClick={this.handleClick} />
                    <MenuItem name="Content" active={this.state.page == "Content" ? true : false} onClick={this.handleClick} />
                    <MenuItem name="Users" active={this.state.page == "Users" ? true : false} onClick={this.handleClick} />
                </Menu>
            </div>
            <div className="thirteen wide column">
                {page}
            </div>
        </div>);
    }
});

ReactDOM.render(<App />, document.getElementById('container'));