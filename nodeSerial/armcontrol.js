"use strict"

var SerialPort = require('serialport');
var serialPort = new SerialPort('/dev/tty.usbmodem1411', { baudRate: 9600 });

//for MongoDB
var mongojs = require('mongojs');
var config = require('./config.js');

//for http request
const http = require('http');

var db = mongojs(config.mlabstring, ["submissions"]);
var liveVideos = [];
var loadedCommentID = [];
var count = 1;
var filterstrings = ['right','left','down', 'up'];
//var filterstrings = ['red','green','yellow', 'blue'];

serialPort.on('open', onSerialOpen);
serialPort.on('error', onError);

function onError(err) {
    err && console.error(err);
}

function onSerialOpen() {
	console.log("serial port open");
	serialPort.on('data', onData);
}

function onData(data) {
    process.stdout.write(data);
}

db.submissions.distinct(
	"liveVideoID",
	{}, // query object
	(function(err, docs){
	if(err){
    	return console.log(err);
	}
	if(docs){  
    	//console.log(docs);
    	console.log("SELECT VIDEO")
    	for (var i=0; i<docs.length;i++){
    		//var vidID = parseInt(docs[i]);
    		liveVideos.push(docs[i]);
    		
    		console.log(i+" : " + docs[i]);
    	}
	}
	})
);

process.stdin.on('data', getComments);

function getComments(data){
	var index = parseInt(data);
	var vidID = liveVideos[index];
	
	// CUMULATIVE
	// var stringCount = [];
	// for (var i =0; i<filterstrings.length; i++){
	// 		stringCount[i]=0; //initializing values
	// } 

	console.log("Getting comments from video "+ vidID);
	setInterval(function(){
		
		// RESET EVERY CYCLE
		var stringCount = [];
		for (var i =0; i<filterstrings.length; i++){
			stringCount[i]=0; //initializing values
		} 

		console.log("getting comments.. iteration:" + count);
		db.submissions.find({liveVideoID:vidID}, function(err, docs) {
	    	if (err || !docs) {
	    		console.log("No results");
	    	}
	    	else {
	      		//console.log(docs);
	      		for (var i=0; i<docs.length; i++){
	      			var isAlreadySaved = false;
	      			var currentCommentID = docs[i]._id;

	      			if (loadedCommentID){
	      				for (var j=0; j<loadedCommentID.length; j++){
	      					if (loadedCommentID[j].id == currentCommentID){
	      						isAlreadySaved = true;
	      						break;
	      					}
	      				}
	      			}

	      			if(!isAlreadySaved){
	      				var newComment = {
	      					id : currentCommentID,
	      					message : docs[i].commentMessage
	      				}
	      				loadedCommentID.push(newComment);
	      				console.log("saved comment id : " + newComment.id);
	      				console.log("saved comment msg : " + newComment.message);
	      				var mentionArray = processComment(newComment.message);
	      				for (var j=0; j<stringCount.length; j++){
	      					stringCount[j] += mentionArray[j];
	      				}
	      			}
	      		}

	      		// RESET EVERY CYCLE
	      		//console.log(stringCount);
	      		//DO SERIAL ACTION HERE
	      		sendData(stringCount);
	    	}
	  	});
	  	count++;
	  	
	  	// CUMULATIVE
	  	//console.log(stringCount);
  		//DO SERIAL ACTION HERE
  		//sendData(stringCount);
	},2000);
}

function processComment(data){
	var stringMention = []; 
	var passedString = data.toLowerCase();
	console.log(passedString);
	for (var i =0; i<filterstrings.length; i++){
		if (passedString.includes(filterstrings[i])){
			stringMention[i] = 1;
		} else {
			stringMention[i] = 0;
		}
	}
	return stringMention;
}

function sendData(arrayInput) {
    //var sentArray = [];
    var horizontal = (arrayInput[0] - arrayInput[1]) * 15;
    var vertical = (arrayInput[2] - arrayInput[3]) * 15;

    var sentString = vertical+","+horizontal;
    serialPort.write(sentString, onError)
    console.log("SENDING: "+ sentString);
    
}