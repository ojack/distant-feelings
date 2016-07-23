var SocketIoConnection = require('./libs/socketioconnection');
var WildEmitter = require('wildemitter');
var getUserMedia = require('getusermedia');
var Peer = require('./PeerOld.js');

function LiveLab(config, props){
    this.props = props;
    this.peers = [];
    this.rtcConfig = config.defaultRTCConfig;
     // call WildEmitter constructor -- currently NOT working
    WildEmitter.call(this);

    //create socketIO connection to signalling server localSignalling
   // var connection = this.connection = new SocketIoConnection({"url": config.defaultRTCConfig.localSignalling});
    var connection = this.connection = new SocketIoConnection({"url": config.defaultRTCConfig.signallingServer});
  
    connection.on('connect', function () {

        var id = connection.getSessionid();
        console.log("CONNECTED", id);
        this.props.updateSessionParams({sessionId: id});
    }.bind(this));

    connection.on('message', function(message) {
        var peers = this.peers;
        var peer;
       // console.log("received", message.type, message);
        if (message.type === 'offer') {
            if (peers.length) {
                peers.forEach(function (p) {
                    if (p.sid == message.sid) peer = p;
                });
                //if (!peer) peer = peers[0]; // fallback for old protocol versions
            }
            if (!peer) {
                console.log("TO DO new peew");
                // peer = self.webrtc.createPeer({
                //     id: message.from,
                //     sid: message.sid,
                //     type: message.roomType,
                //     enableDataChannels: self.config.enableDataChannels && message.roomType !== 'screen',
                //     sharemyscreen: message.roomType === 'screen' && !message.broadcaster,
                //     broadcaster: message.roomType === 'screen' && !message.broadcaster ? self.connection.getSessionid() : null
                // });
                // self.emit('createdPeer', peer);
                peer = new Peer({
                            id: message.from,
                            sid: message.sid,
                            type: message.roomType,
                            parent: this,
                            connection: this.connection,
                            localStreams: this.props.state.localStreams,
                            connectionConstraints: this.rtcConfig.peerConnectionConstraints,
                            connectionConfig: this.rtcConfig.peerConnectionConfig
                        });
            }
            peer.handleMessage(message);
        } else if (peers.length) {
            peers.forEach(function (peer) {
                if (message.sid) {
                    if (peer.sid === message.sid) {
                        peer.handleMessage(message);
                    }
                } else {
                    peer.handleMessage(message);
                }
            });
        }
    }.bind(this));

    connection.on('remove', function (room) {
        if (room.id !== self.connection.getSessionid()) {
            self.webrtc.removePeers(room.id, room.type);
        }
    });

    this.getLocalMedia();
}

/*open new socket connection to receive  UDP stream*/
LiveLab.prototype.getLocalMedia = function (params) {
    /*param options {video: true, audio: true}
    TO DO: check whether supports selecting input sources via 
    https://github.com/webrtc/samples/blob/gh-pages/src/content/devices/input-output/js/main.js*/
    if(params==null) params = {audio: true, video: true};
   getUserMedia(params, function (err, stream) {
        // if the browser doesn't support user media 
        // or the user says "no" the error gets passed 
        // as the first argument. 
        if (err) {
           console.log('failed', err);
        } else {
           console.log('got a stream', stream);  
           this.joinRoom("interactivos");
           this.props.addLocalStream(stream);
        }
    }.bind(this));
}

LiveLab.prototype.joinRoom = function(room){
    this.connection.emit('join', name, function (err, roomDescription) {
        console.log('join CB', err, roomDescription);
        // var nick = localStorage.getItem("livelab-localNick");
        // // we don't have any nick saved in local storage - just use the
        // // localId as nick
        // if (nick === null) {
        //     nick = window.localId;
        // }
        // // if amount of clients given by roomDescription is 0, then we have
        // // joined an empty room
        // window.hasStateInfo = (Object.keys(roomDescription.clients).length) === 0;
        // if (window.hasStateInfo) {
        //     window.stateInfo.peers.push({id: window.localId, nick: nick});
        // }

        if (err) {
            self.emit('error', err);
        } else {
            var id, client, type, peer;
            for (id in roomDescription.clients) {
                client = roomDescription.clients[id];
                for (type in client) {
                    if (client[type]) {
                        peer = new Peer({
                            id: id,
                            type: type,
                            parent: this,
                            connection: this.connection,
                            localStreams: this.props.state.localStreams,
                            connectionConstraints: this.rtcConfig.peerConnectionConstraints,
                            connectionConfig: this.rtcConfig.peerConnectionConfig
                        });
                       
                       peer.start();
                    }
                }
            }
            this.peers.push(peer);
        }
    }.bind(this));
}

module.exports = LiveLab;
