var React = require("react");

var MenuItem = React.createClass({
    handleClick: function(e) {
        e.preventDefault();
        
        this.props.active = true;
        this.render();
    },
    
    render: function() {
        var name = this.props.name;
        var label = this.props.label;
        
        console.log("Rendering " + name)
        
        var className = (this.props.active == "true" || this.props.active) ? 'active item' : 'item';
        var badge = "";
        
        if ($.isNumeric(label) && label > -1)
            badge = (<div className="ui teal label">{label}</div>);
        
        return (
            <a onClick={this.handleClick} className={className}>
                {name}
                {badge}
            </a>
        );
    }
});

module.exports = MenuItem;