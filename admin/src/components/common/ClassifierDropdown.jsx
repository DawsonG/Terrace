var React = require("react");
var ReactDOM = require("react-dom");

var ClassifierDropdown = React.createClass({
    getInitialState: function() {
        var value = "";
        if (this.props.multiple)
            value = [];
            
        return { value: value, classifiers : [] };
    },
    
    componentDidMount: function() {
        var self = this;
        
        this.serverRequest = $.get('/api/posts/getClassifiers', { field: this.props.field }, function(data) {
            self.setState({ value: self.props.value, classifiers: data });
            
            var dom = ReactDOM.findDOMNode(self);
            $(dom).dropdown({
                placeholder: self.props.placeholder,
                allowAdditions: true
            });
        });
    },
    
    componentWillUnmount: function() {
        this.serverRequest.abort();
    },
    
    render: function() {
        var self = this;
        
        return (
            <select className="ui fluid search dropdown" value={this.state.value} onChange={this.props.onChange} multiple={this.props.multiple || false}>
                {this.state.classifiers.map(function(state) {
                   return (<option key={state._id} value={state.name}>{state.name}</option>);
                })}
            </select>
        );
    }
});

module.exports = ClassifierDropdown;