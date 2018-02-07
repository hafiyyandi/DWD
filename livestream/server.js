var express = require('express');
var app = express();

//required for POST method
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true}); //for parsing form data
app.use(urlencodedParser);

//Templates
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

app.get('/', function (req, res) {
  res.send('Hi there, this is livestream directory.');
});


app.get('/fblogin', function (req, res) {
	var loginURL = "https://www.facebook.com/v2.12/dialog/oauth?";
	var app_id = "294044474454157";
	var redirect_uri = "165.227.205.200:3000/loggedin"
	var state_param = "st=state123"
	loginURL = loginURL + "client_id={" + app_id + "}&redirect_uri={" + redirect_uri + "}&state={" + state_param + "}"
	console.log(loginURL);
	
	res.redirect(loginURL);
});

app.get('/loggedin', function (req,res){
	res.send('HELLO you\'re logged in, I guess');

});





