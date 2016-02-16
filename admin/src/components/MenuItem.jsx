var React = require("react");

var MenuItem = React.createClass({
    render: function() {
        var name = this.props.name;
        var label = this.props.label;
        var className = this.props.active == "true" ? 'active item' : 'item';
        var badge = "";
        
        if ($.isNumeric(label) && label > -1)
            badge = (<div className="ui teal label">{label}</div>);
        
        return (
            <a className={className}>
                {name}
                {badge}
            </a>
        );
    }
});

module.exports = MenuItem;