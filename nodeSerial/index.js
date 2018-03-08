var SerialPort = require('serialport');
 
// list serial ports:
SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
  });
});

var myPort = new SerialPort('/dev/tty.usbmodem1411', 4800);

var Readline = SerialPort.parsers.Readline; // make instance of Readline parser
var parser = new Readline(); // make a new parser to read ASCII lines
myPort.pipe(parser); // pipe the serial stream to the parser

myPort.on('open', () => {
  console.log('Port Opened');
  myPort.write("test");
});

// myPort.write('main screen turn on', (err) => {
//   if (err) { return console.log('Error: ', err.message) }
//   console.log('message written');
// });

myPort.on('data', (data) => {
  /* get a buffer of data from the serial port */
  console.log("On Data "+data);
});