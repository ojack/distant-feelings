var LiveLabRTC = require('./LiveLabRTC.js'); 

//eventually these settings should be in config
var tempConfig = {localVideoEl: "video_local",
       localVideo: {
               autoplay: true,
               mirror: false,
               muted: false
           },
       nick: localStorage.getItem("livelab-localNick") || window.localId,
       // the id/element dom element that will hold remote videos
       remoteVideosEl: '',
       // immediately ask for camera access
       autoRequestMedia: true,
       debug: false,
       detectSpeakingEvents: true,
       autoAdjustMic: false,
       adjustPeerVolume: false,
       peerVolumeWhenSpeaking: 1.0,
       media: {
         audio: {
           optional: [
          {googAutoGainControl: true}, 
           {googAutoGainControl2: true}, 
           {googEchoCancellation: true},
           {googEchoCancellation2: true},
           {googNoiseSuppression: true},
           {googNoiseSuppression2: true},
           {googHighpassFilter: true},
           {googTypingNoiseDetection: true},
           {googAudioMirroring: true}
           ]
         },
         video: {
           optional: [
           ]
         }
       }
   };

function LiveLabSimple(config, props){
    this.initLocalStorage();
    this.config = config;
    this.props = props;
    var webrtc = new LiveLabRTC(tempConfig);
    webrtc.on('readyToCall', function () {
        console.log(webrtc);
        window.localId = webrtc.connection.connection.id;
        if (this.props.state.room) webrtc.joinRoom(this.props.state.room);
        this.props.addLocalStream(webrtc.webrtc.localStreams[0]);
    }.bind(this));

    webrtc.on('localScreenAdded', function (el) {
      // to do: add to local screens list
    });

    webrtc.on("localScreenStopped", function (stream) {
        // to do: add to local screens list
    });

    webrtc.on('channelMessage', function (peer, label, data) {
        if (data.type=="chat") {
            // var name = document.getElementById("header_" + peer.id).innerHTML;
            // chatWindow.appendToChatLog(name, data.payload);

            //chat add to state
        } else if (data.type=="osc") {
            // oscChannels.receivedRemoteStream(data, peer.id, label);
            // sessionControl.oscParameter(data.payload);
        } else if (data.type === "sessionInfo"){
            // one of the peers changed the name of their window
            if (label === "nameChange") {
                // update the header of the peer that changed their name
                //document.getElementById("header_" + peer.id).innerHTML = util.escapeText(data.payload);
            } else if (label === "shareState" && !window.hasStateInfo) {
                // update the state of this client to reflect the state of the room
                window.stateInfo = JSON.parse(data.payload);
                window.hasStateInfo = true;
                // reflect the changes in the browser
                window.stateInfo.peers.forEach(function(existingPeer) {
                    if (existingPeer.id !== localId && existingPeer.nick) {
                        document.getElementById("header_" + existingPeer.id).innerHTML = util.escapeText(existingPeer.nick);
                    }
                });
            }
        } else if(data.type=="code-lab"){
           // sessionControl.remoteCodeChange(data.payload);
        } else if(data.type=="mixer"){
            console.log("MIXER", label, data);
           // sessionControl.remoteMixerEvent(label, data.payload);
        }
    });

     webrtc.on('videoAdded', function (peer) {
         console.log("VIDEO ADDED", webrtc);
         this.props.updatePeers(webrtc.webrtc.peers);
         /*add new peer to peer object*/
         // var newPeer = new PeerMediaContainer(peer.id, video, webrtc, dashboard, peer.nick);
         // peers[peer.id] = {peer: peer, peerContainer: newPeer, dataStreams: {}};
         // newPeer.video.addEventListener("click", function(e){
         //     console.log("setting video ", e.target);
         //     sessionControl.setVideo(e.target);
         // });

         // if (window.hasStateInfo) {
         //     // check to see if the new peer resides inside the peers list of
         //     // the window.stateInfo object. if not: add it
         //     var peerExists = false;
         //     window.stateInfo.peers.forEach(function(existingPeer) {
         //         if (peer.id === existingPeer.id) {
         //             peerExists = true;
         //             return;
         //         }
         //     });

         //     if (!peerExists) {
         //         window.stateInfo.peers.push({id: peer.id, nick: peer.nick});
         //     }
         //     // send the state information to everyone 
         //     // TODO: preferably only send it to the connected peer
         //     setTimeout(function() {
         //         webrtc.sendDirectly(peer.id, "shareState", "sessionInfo", JSON.stringify(window.stateInfo));
         //     }, 2500);
         // } else {
         //     // don't do shit
         // }
        // update the newly connected peer with the session info for this
        // channel
        // {collect session info somehow}
     }.bind(this));

    var self = this;
    webrtc.on('videoRemoved', function (peer) {
      console.log(webrtc.webrtc.peers);
         this.props.updatePeers(webrtc.webrtc.peers);
        // var index = -1;
        // for (var i = 0; i < window.stateInfo.peers.length; i++) {
        //     var existingPeer = window.stateInfo.peers[i];
        //     if (peer.id === existingPeer.id) {
        //         index = i;
        //         break;
        //     }
        // }
        // // remove the peer from the stateInfo object
        // window.stateInfo.peers.splice(index, 1);
        // var peerObj = peers[peer.id];
        // peerObj.peerContainer.destroy();
        // delete peers[peer.id];
    }.bind(this));
}

LiveLabSimple.prototype.initLocalStorage = function(){
   window.hasStateInfo = false;
window.localId = "";

// structure of state info object:
// peers: list of peers, each peer has an id and a nick as following:
// {peers: [{id: SDsd8zjcxke23, nick: pablo}, {id: zxczxc9(qeasd, nick: ojack)}]}
window.stateInfo = {peers: []};

}

module.exports = LiveLabSimple;
