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
            <h1>DASHBOARD</h1>
        </div>);
    }
});

module.exports = Dashboard;
