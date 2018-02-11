"use strict"

var express = require('express');
var app = express();

//required for POST method
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true}); //for parsing form data
app.use(urlencodedParser);

//for HTTPS requests
const https = require('https');

//for MongoDB
var mongojs = require('mongojs');
var config = require('./config.js');

//Templates
app.set('view engine', 'ejs');

//PROGRAMS & FUNCTIONS
var vidList;
var db = mongojs(config.mlabstring, ["submissions"]);

//For public directory files
app.use(express.static('public'));

app.listen(80, function () {
  console.log('Example app listening on port 80!')
});

app.get('/', function (req, res) {
  res.send('Hi there, this is livestream directory.');
});


// app.get('/fblogin', function (req, res) {
// 	var loginURL = "https://www.facebook.com/v2.12/dialog/oauth?";
// 	var app_id = "294044474454157";
// 	var redirect_uri = "http://165.227.205.200:3000/loggedin"
// 	var state_param = "st=state123"
// 	//loginURL = loginURL + "client_id={" + app_id + "}&redirect_uri={" + redirect_uri + "}&state={" + state_param + "}"
// 	loginURL = loginURL + "client_id=" + app_id + "&redirect_uri=" + redirect_uri + "&state={" + state_param + "}";
// 	console.log(loginURL);
	
// 	res.redirect(loginURL);
// });

// app.get('/loggedin', function (req,res){
// 	res.send('HELLO you\'re logged in, I guess');

// });

app.get('/fbtest', function (req, res) {
	res.render('template.ejs');
});


app.get('/getlivestream', function (req, res) {
	var token = req.query.token;
	var ID = req.query.ID;
	
	console.log("token: " + token);
	console.log("ID: "+ ID);
	var getVidListURL = "https://graph.facebook.com/v2.12/" + ID + "/live_videos?access_token=" + token;

	https.get(getVidListURL, (resp) => {
	  let data = '';

	  // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });

	  // The whole response has been received. Print out the result.
	  resp.on('end', () => {
	    //console.log(JSON.parse(data).explanation);
		vidList = JSON.parse(data);
		//console.log("ALL VIDEOS")
		//console.log(vidList);
		
		var liveID;

		for (var i=0; i<vidList.data.length; i++){
			console.log(vidList.data[i].id + ": " + vidList.data[i].status);
			if (vidList.data[i].status =='LIVE'){
				liveID = vidList.data[i].id;
				console.log("live ID: " +liveID)
				break;
			}
		}

		if (liveID){
			var getCommentListURL = "https://graph.facebook.com/v2.12/" + liveID + "/comments?access_token=" + token;
			res.redirect(getCommentListURL);
		}
		
	  });

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});

  	//res.redirect(getURL);
  	// app.get(getURL, function (req, res){
  	// 	var data = req.query;
  	// 	console.log(data);
  	// });
});





