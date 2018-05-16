// Useful packages => Must be imported
const uuidv4 = require('uuid/v4');
var dgram = require('dgram');

// Some UDP constants : port and boradcast address
var PORT_UDP = 4242;
var MULTICAST_ADRESS = '239.255.255.1';


// Let's create a datagram socket. We will use it to send our UDP datagrams
var s = dgram.createSocket('udp4');
//s.bind(PORT_UDP);

// ======== Attributing an instrument to the musician ========

// Create a Musician object and serialize it to JSON
console.log("Creating a new musician");
var musician = new Object();
musician.uuid = uuidv4();

var arg = process.argv[2];
var instrument = new Object();

switch (arg){
    case 'piano':
        instrument.name = "piano";
        instrument.sound = "ti-ta-ti";   
        break;
    case 'trumpet':
        instrument.name = "trumpet";
        intrument.sound = "pouet";
        break;
    case 'flute':
        instrument.name = "flute";
        instrument.sound = "trulu";
        break;
    case 'violin' :
        instrument.name = "violin";
        instrument.sound = "gzi-gzi";
        break;
    case 'drum':
        instrument.name = "drum";
        instrument.sound = "boum-boum";
        break;
    default:
        console.log("Error : Unknown instrument");
        process.exit(-1);
        break;
}

// TODO : We must send the sound of the instrument. The server will deduct what instrument it is according to the sound it receive. But anyway. It works.
musician.instrument = instrument.name;
musician.activeSince = Date.now();
var payload = JSON.stringify(musician);
// ============================================================



//create the udp multicast connexion
setInterval(function () {
    // Send the payload via UDP (multicast)
    message = new Buffer(payload);
    
    //s.bind(PORT_UDP);
    s.send(message, 0, message.length, PORT_UDP, MULTICAST_ADRESS, 
        function(err, bytes) {
            console.log("Sending payload: " + payload + " via port " + s.address().port);
        }
    );
    //s.close();
}, 1000);