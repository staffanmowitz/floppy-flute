
var inData;
var serial;          // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1421';  // fill in your serial port name here

function setup() {
 	createCanvas(400, 300);

  serial = new p5.SerialPort();       // make a new instance of the serialport library
  //serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  serial.open(portName);


}

  function serverConnected() {
    print('connected to server.');
  }

  function portOpen() {
    print('the serial port opened.')
  }

  function serialEvent() {
    inData = serial.readStringUntil('\n');
    print(inData);
  }

  function serialError(err) {
    print('Something went wrong with the serial port. ' + err);
  }

  function portClose() {
    print('The serial port closed.');
  }
  function draw() {
		background(0);
  	fill(255);
  	text("sensor value: " + inData, 30, 30);
	}
  export const expData = () =>{
    return inData;
  }
