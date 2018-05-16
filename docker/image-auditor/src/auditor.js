// Useful packages => Must be imported
var dgram = require('dgram');
var net = require('net');

// Where will be stored the musicians
var playingMusicians = new Array();

// Some constants : definition of ports ands addresses
var PORT_TCP = 2205;
var PORT_UDP = 4242;
var HOST = '0.0.0.0';
var MULTICAST_ADDRESS = '239.255.255.1';


// Setting up TCP stuff
var serverTCP = net.createServer(function(socket) {
    console.log("Receiving TCP request");
    var payload = JSON.stringify(playingMusicians);
    console.log("Sending following JSON payload : " + payload)
	socket.write(payload);
	socket.end()
});

serverTCP.listen(PORT_TCP, HOST);

// Setting up UDP stuff
var serverUDP = dgram.createSocket('udp4');
serverUDP.bind(PORT_UDP, function() {
    console.log("Joining multicats group : listening to musicians");
    serverUDP.addMembership(MULTICAST_ADDRESS);
});

serverUDP.on('listening', function () {
    var address = serverUDP.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);

});

// When we receive à UDP message => A playing musician
serverUDP.on('message', function (message, remote) {
    console.log("Just received : " + message);
    var musicien = JSON.parse(message);
    console.log(JSON.stringify(musicien));
    var alreadyPlaying = false;

    // Updating his date if he's already in the array
    for(var i = 0; i < playingMusicians.length; ++i){
        if(playingMusicians[i].uuid === musicien.uuid){
            playingMusicians[i].activeSince = Date.now();
            alreadyPlaying = true;
            break;
        }
    }

    // Adding him if he's not already in the array
    if(!alreadyPlaying){
        console.log("Inserting new musician");
        musicien.activeSince = Date.now();
        playingMusicians.push(musicien);
    }
});

// Removing the musicians who haven't been playing for 5 seconds
setInterval(function () {
    for (var i = 0; i < playingMusicians.length; ++i) {
        console.log(new Date(Date.now()).getTime());
        console.log(new Date(playingMusicians[i].activeSince).getTime());
        console.log(new Date(Date.now()).getTime() - new Date(playingMusicians[i].activeSince).getTime());
        console.log(playingMusicians);
        if (new Date(Date.now()).getTime() - new Date(playingMusicians[i].activeSince).getTime() >= 5000) {
            console.log("Removing one musician");
            playingMusicians.splice(i, 1);
            i--;
        }
    }
}, 1000);