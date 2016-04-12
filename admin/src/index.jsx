/** @jsx React.DOM */
'use strict';
// pull in our stylesheets
var css = require("./scss/styles.scss"); // Custom

// For semantic UI
require("../js/semanticui.min.js");

// For quill editor
require("../css/quill.base.css");
require("../css/quill.snow.css");

var React = require('react');
var ReactDOM = require('react-dom');

// React Router
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;

// Main Pages
var Dashboard = require("./components/Dashboard");
var Content = require('./components/Content');
var Media = require("./components/Media");
var Settings = require("./components/Settings");
var Users = require("./components/Users");

// Menu / Navigation
var Menu = require('./components/Menu');
var MenuItem = require('./components/MenuItem');

// Error/404 Handling
var NoMatch = require('./components/NoMatch');

// The root of all our documents.
var App = React.createClass({
    getInitialState: function() {
        return {};
    },
    
    render: function() {
        return (<div className="ui grid">
            <div className="three wide column">
                <Menu>
                    <MenuItem name="Dashboard" indexRoute={true} label="0"  />
                    <MenuItem name="Content" />
                    <MenuItem name="Media" />
                    <MenuItem name="Settings" />
                    <MenuItem name="Users" />
                </Menu>
            </div>
            <div className="thirteen wide column">
                {this.props.children}
            </div>
        </div>);
    }
});

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/admin" component={App}>
            <IndexRoute component={Dashboard} />
            <Route path="Content" component={Content} />
            <Route path="Media" component={Media} />
            <Route path="Settings" component={Settings} />
            <Route path="users" component={Users} />
        </Route>
        <Route path="*" component={NoMatch}/>
    </Router>  
), document.getElementById('container'));