var SerialPort = require('serialport');
var serialPort = new SerialPort('/dev/tty.usbmodem1411', { baudRate: 9600 });


function onData(data) {
    process.stdout.write(data);
}

function onSerialOpen() {
  serialPort.on('data', onData);
  //serailPort.write('hello', onError);
}

function onError(err) {
    err && console.error(err);
}

function writeData(data) {
    serialPort.write(data, onError)
    console.log("SENDING: "+ data);
}

// serialPort.on('readable', function () {
//   console.log('Data:', parseInt(serialPort.read()));
// });

serialPort.on('open', onSerialOpen);
serialPort.on('error', onError);

process.stdin.on('data', writeData);