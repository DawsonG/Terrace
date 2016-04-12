var React = require('react');

var NoMatch = React.createClass({
    displayName: "NoMatch",
    
    render: function() {
        return (<div>
            <h1 className="ui dividing header">No Match</h1>
            <p>Something appears to have gone wrong.  The page you have requested cannot be found.</p>
        </div>);
    }
});

module.exports = NoMatch;
