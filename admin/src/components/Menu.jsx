var React = require('react');

var Menu = React.createClass({
    render: function() {
        return (<div className="ui vertical pointing menu">
            {this.props.children}
        </div>);
    }
});

module.exports = Menu;