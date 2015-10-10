var React = require('react');
var ReactDOM = require('react-dom');
//var App = require('./components/App');

var App = React.createClass({
  render: function(){
    return (
      <div>
        Hello World!
      </div>
    )
  }
});

ReactDOM.render(<App />, document.getElementById('container'));