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

app.post('/savingintoDB', function(req, res){
	searchterms[0] = req.body.firstword;
	searchterms[1] = req.body.secondword;
	searchterms[2] = req.body.thirdword;

	var inputObject = {data: [searchterms[0], searchterms[1], searchterms[2]]};
	console.log(inputObject.data);
	
	db.insert(inputObject, function(err, newDocs){
		console.log("err: " + err);
		console.log("newDocs: " + newDocs.data);
		res.redirect('/processingDB');
	});

	
	
	//res.redirect('/result.html');
	
});

app.get('/processingDB', function(req, res)){
	var storedData =[];
	db.find({}, function(err, docs) {
		// Loop through the results, send each one as if it were a new chat message
		for (var i = 0; i < docs.length; i++) {
			for (var j =0; j<docs[i].length;j++){
				storedData.push(docs[i][j]);
			}
		}
	});
	console.log("stored: "+storedData);
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