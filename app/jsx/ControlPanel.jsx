var React = require('react');
var VideoContainer = require('./VideoContainer.jsx');

module.exports = React.createClass({
	render: function(){
		var localVids = this.props.s.localStreams.map(function(stream, index){
			return <VideoContainer stream={stream} muted={true} key={index} dimensions={this.props.s.dimensions}/>
		}.bind(this));
		console.log("PEERS ", this.props.s.peers);
		var remoteVids = this.props.s.peers.map(function(peer, index){
			return <VideoContainer stream={peer.stream} muted={false} key={"peer_"+index} dimensions={this.props.s.dimensions}/>
		}.bind(this));
		return <div>
			{localVids}
			{remoteVids}
			</div>;
	}
});