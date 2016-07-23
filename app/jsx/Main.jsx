var React = require('react');
var Landing = require('./Landing.jsx');
var ControlPanel = require('./ControlPanel.jsx');
var configData = require('./config.json');
var LiveLab = require('./LiveLabSimple.js');

module.exports = React.createClass({
	/*set room variables from config.json*/
	getInitialState: function(){
		return {room: configData.room, localStreams: [], peers:[], dimensions: {width: 1280, height: 720}}
	},
	/*check for room name in URL, and join room if not null*/
	componentDidMount: function(){
		this.setState({dimensions: {width: window.innerWidth, height: window.innerHeight}});
		window.onresize = function(e){

			console.log("updating dimensions");
			this.setState({dimensions: {width: window.innerWidth, height: window.innerHeight}});
		}.bind(this);
		var room = location.search && location.search.split('?')[1];
		var liveLab = new LiveLab(configData, this);
		if(room) {
			//liveLab.joinRoom(room);
			this.setState({room: room});
		}
	}, 
	updateSessionParams: function(update){
		this.setState({update});
	},
	addLocalStream: function(stream){
		var localStreams = this.state.localStreams;
		localStreams.push(stream);
		console.log(localStreams);
		this.setState({localStreams: localStreams});

	},
	updatePeers: function(peers){
		this.setState({peers:peers});
	},
	render: function(){
		if(this.state.room == null){
			return <Landing />;
		} else {
			return <ControlPanel s={this.state}/>;
		}
		
	}
});