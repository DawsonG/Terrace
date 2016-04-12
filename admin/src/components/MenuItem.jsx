var React = require("react");
var IndexLink = require("react-router").IndexLink;
var Link = require("react-router").Link;

var MenuItem = React.createClass({
    render: function() {
        var name = this.props.name;
        var path = this.props.path || name.toLowerCase();
        var link = '/admin/' + path;
        if (this.props.indexRoute)
            link = "/admin/";
        
        var label = this.props.label;
        
        var badge = "";
        
        if ($.isNumeric(label) && label > -1)
            badge = (<div className="ui teal label">{label}</div>);

        return (
            <Link to={link} className="item" onlyActiveOnIndex={this.props.indexRoute} activeClassName="active">
                {name}
                {badge}
            </Link>
        );
    }
});

module.exports = MenuItem;