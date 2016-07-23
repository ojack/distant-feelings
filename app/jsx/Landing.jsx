var React = require('react');

module.exports = React.createClass({
	render: function(){
		return (<form id="createRoom">
             <h1>Start a room</h1>
            <input id="sessionInput"/>
            <button type="submit">Create it!</button>
        </form>);
	}
});