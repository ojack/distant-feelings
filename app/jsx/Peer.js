var webrtc = require('webrtcsupport');

function Peer(options) {
    
    this.sid = options.id;
    // this.parent = options.parent;
    this.type = options.type || 'video';
    // this.oneway = options.oneway || false;
    // this.sharemyscreen = options.sharemyscreen || false;
    // this.browserPrefix = options.prefix;
    // this.stream = options.localStreams[0];
    // this.localStreams = options.localStreams;
    // this.enableDataChannels = options.connectionConfig.enableDataChannels;
    // this.receiveMedia = options.connectionConfig.receiveMedia;
    // this.channels = {};
    // this.connection = options.connection;
    // this.connectionConfig = options.connectionConfig;
    // this.connectionConstraints = options.connectionConstraints;
    this.receiveMedia = options.connectionConfig.receiveMedia;
    this.connection = options.connection;
    this.pc = new RTCPeerConnection(options.connectionConfig);
    this.pc.onicecandidate = this.onIceCandidate;
    this.pc.addStream(options.localStreams[0]);
}

Peer.prototype.start = function(){
    
}

Peer.prototype.onIceCandidate = function(event){
    console.log("icecandidate", event);
    if (event.candidate) {
    // getOtherPc(pc).addIceCandidate(
    //   new RTCIceCandidate(event.candidate)
    // ).then(
    //   function() {
    //     onAddIceCandidateSuccess(pc);
    //   },
    //   function(err) {
    //     onAddIceCandidateError(pc, err);
    //   }
    // );
    // trace(getName(pc) + ' ICE candidate: \n' + event.candidate.candidate);
  }
}

Peer.prototype.send = function (messageType, payload) {
    var message = {
        to: this.id,
        sid: this.sid,
        broadcaster: this.connection.getSessionId,
        roomType: this.type,
        type: messageType,
        payload: payload,
        prefix: webrtc.prefix
    };
    this.connection.emit('message', message);
    //this.parent.emit('message', message);
};

Peer.prototype.handleMessage = function (message) {
    var self = this;

    console.log('getting', message.type, message);

    // if (message.prefix) this.browserPrefix = message.prefix;

    // if (message.type === 'offer') {
    //     this.pc.handleOffer(message.payload, function (err) {
    //         if (err) {
    //             return;
    //         }
    //         // auto-accept
    //         self.pc.answer(function (err, sessionDescription) {
    //             //self.send('answer', sessionDescription);
    //         });
    //     });
    // } else if (message.type === 'answer') {
    //     if (!this.nick) this.nick = message.payload.nick;
    //     delete message.payload.nick;
    //     this.pc.handleAnswer(message.payload);
    // } else if (message.type === 'candidate') {
    //     this.pc.processIce(message.payload);
    // } else if (message.type === 'connectivityError') {
    //     this.parent.emit('connectivityError', self);
    // } else if (message.type === 'mute') {
    //     this.parent.emit('mute', {id: message.from, name: message.payload.name});
    // } else if (message.type === 'unmute') {
    //     this.parent.emit('unmute', {id: message.from, name: message.payload.name});
    // } else if (message.type === 'endOfCandidates') {
    //     // Edge requires an end-of-candidates. Since only Edge will have mLines or tracks on the
    //     // shim this will only be called in Edge.
    //     var mLines = this.pc.pc.peerconnection.transceivers || [];
    //     mLines.forEach(function (mLine) {
    //         if (mLine.iceTransport) {
    //             mLine.iceTransport.addRemoteCandidate({});
    //         }
    //     });
    // }
};

module.exports = Peer;
