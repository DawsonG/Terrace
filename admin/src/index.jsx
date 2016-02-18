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
    render: function() {
        return (<div className="ui grid">
            <div className="three wide column">
                <Menu>
                    <MenuItem name="Dashboard" label="0" active="true" />
                    <MenuItem name="Content" />
                    <MenuItem name="Users" />
                </Menu>
            </div>
            <div className="thirteen wide column">
                <Dashboard />
            </div>
        </div>);
    }
});

ReactDOM.render(<App />, document.getElementById('container'));