var React = require('react');

var Dashboard = React.createClass({
    displayName: "Dashboard",
    getInitialState: function() {
        return { "panels": [] };
    },
    
    componentDidMount: function() {
        
    },
    
    render: function() {
        return (<div>
            <h1 className="ui dividing header">DASHBOARD</h1>
            <p>One day, I very seriously hope to have actual things here.</p>
        </div>);
    }
});

module.exports = Dashboard;
