var express = require('express');
var app = express();

//required for POST method
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true}); //for parsing form data
app.use(urlencodedParser);

// var data = {
// 	name: "Hafi",
// 	other: "test test test"
// };

var vidList;

//Templates
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.listen(80, function () {
  console.log('Example app listening on port 80!')
});

app.get('/', function (req, res) {
  res.send('Hi there, this is livestream directory.');
});


//for HTTPS requests
var https = require('https');

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
	res.render('template.ejs', data);
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
		// do seomthing
		vidList = JSON.parse(data);
		console.log(vidList.data[0].id);
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





