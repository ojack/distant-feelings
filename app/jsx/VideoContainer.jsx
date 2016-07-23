var React = require('react');


module.exports = React.createClass({
	componentDidMount: function(){
	// 	console.log("REF", this.refs.vid);
	// 	//this.refs.vid.volume = 0.0;
	// 	//this.refs.vid.muted = true;
	// 	//document.getElementById("vid").autoPlay = false;
	// 	// return <video autoPlay controls muted="true" id="vid" ref="vid" src={window.URL.createObjectURL(this.props.stream)} />
	// 	 var videoEl = attachMediaStream(this.props.stream, {
 //        // this will set the autoplay attribute on the video tag 
 //        // this is true by default but you can turn it off with this option. 
 //        autoplay: true, 
        
 //        // let's you mirror the video. It's false by default, but it's common  
 //        // to mirror video when showing a user their own video feed. 
 //        // This makes that easy. 
 //        mirror: true,
 
 //        // muted is false, by default 
 //        // this will mute the video. Again, this is a good idea when showing 
 //        // a user their own video. Or there will be feedback issues. 
 //        muted: true,
 
 //        // attach as an audio element instead of video 
 //        audio: false
 //      });
	// 	 console.log(videoEl);
	},
	render: function(){

		var w = Math.floor(this.props.dimensions.width/3);
		var h = w*480/640;
		var vidStyle = {
			position: "relative",
			top: this.props.dimensions.height/2 - h/2
		}
		return <video autoPlay controls muted={this.props.muted} style={vidStyle} id="vid" ref="vid" width={this.props.dimensions.width/3} height={h} src={window.URL.createObjectURL(this.props.stream)} />
	}
});