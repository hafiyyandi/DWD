var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true}); //for parsing form data
app.use(urlencodedParser);

// Database to store data, don't forget autoload: true
var Datastore = require('nedb');
var db = new Datastore({filename: "data.db", autoload: true});

var count=0;
var submissions = [];
var searchterms =[];

app.use(express.static('public'));

app.get('/count', function (req, res) {
  count++;
  res.send("<html><body><h1>"+count+"</h1></body></html>");
});

app.get('/formpost', function (req, res){
	submissions.push(req.query.textfield);
	res.redirect('/display');
});

app.post('/processgif', function(req, res){
	searchterms[0] = req.body.firstword;
	searchterms[1] = req.body.secondword;
	searchterms[2] = req.body.thirdword;
	//console.log(textvalue);
	for (var i=0; i<searchterms.length; i++){
		db.insert(searchterms[i], function(err, newDocs){
			console.log(i);
			console.log("err: " + err);
			console.log("newDocs: " + newDocs);
		});
	}
	
});

app.post('/processit', function(req, res){
	var textvalue = req.body.textfield;
	//console.log(textvalue);
	db.insert(textvalue, function(err, newDocs){
		//console.log("HEY");
		console.log("err: " + err);
		console.log("newDocs: " + newDocs);
	});
	//res.send("You submitted: "+textvalue);
});

app.get('/display', function(req, res){
	var htmlout = "<html><body>";
	for (var i = 0; i<submissions.length; i++){
		htmlout = htmlout + submissions[i] + "<br>";
	}
	var htmlout = htmlout + "</body></html>";
	res.send(htmlout);
});

app.get('/', function (req, res) {
  res.send('HEY');
});

app.get('/somethingelse', function (req, res) {
  res.send('AYE YO');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});