/* global $ */

var React = require("react");
var ReactDOM = require("react-dom");

var ClassifierDropdown = React.createClass({
    contextTypes: {
       classifiers: React.PropTypes.object
    },
    
    getInitialState: function() {
        var value = "";
        if (this.props.multiple)
            value = [];
            
        return { value: value, classifiers : [] };
    },
    
    renderDropdown: function() {
        var self = this;
        var dom = ReactDOM.findDOMNode(self);
        $(dom).dropdown({
            placeholder: self.props.placeholder,
            allowAdditions: true
        });
    },
    
    componentDidMount: function() {
        var self = this;
        
        if (this.context.classifiers) {
            this.setState({ classifiers: this.context.classifiers });
            this.renderDropdown();
        } else {
            this.serverRequest = $.get('/api/posts/getClassifiers', { field: this.props.field }, function(data) {
                self.setState({ value: self.props.value, classifiers: data });
                self.renderDropdown();
            });
        }
    },
    
    componentWillUnmount: function() {
        this.serverRequest.abort();
    },
    
    render: function() {
        var self = this;
        var classifiers = this.context.classifiers[this.props.field];
        if (typeof classifiers === "undefined") {
            classifiers = [];
        }
        
        return (
            <select className="ui fluid search dropdown" value={this.state.value} onChange={this.props.onChange} multiple={this.props.multiple || false}>
                {classifiers.map(function(state) {
                   return (<option key={state._id} value={state.name}>{state.name}</option>);
                })}
            </select>
        );
    }
});

module.exports = ClassifierDropdown;