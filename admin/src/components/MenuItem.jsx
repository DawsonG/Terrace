var React = require("react");

var MenuItem = React.createClass({
    getInitialState: function() {
      return { active: false };  
    },
    
    handleClick: function() {
      this.props.onClick(this);  
    },
    
    render: function() {
        var name = this.props.name;
        var label = this.props.label;
        
        var className = (this.props.active) ? 'active item' : 'item';
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