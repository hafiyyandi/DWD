var express = require('express');
var app = express();

//required for POST method
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true}); //for parsing form data
app.use(urlencodedParser);

// Database to store data, don't forget autoload: true
var Datastore = require('nedb');
var db = new Datastore({filename: "data.db", autoload: true});

//Templates
app.set('view engine', 'ejs');

var count=1;
var submissions = [];
var searchterms =[];
var lastData;

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
	//searchterms[2] = req.body.thirdword;

	var inputObject = {index: count, data: [searchterms[0], searchterms[1]]};
	console.log(inputObject.data);
	
	db.insert(inputObject, function(err, newDocs){
		console.log("err: " + err);
		console.log("newDocs: " + newDocs.index + " | "+newDocs.data);
		res.redirect('/processingDB');
	});
	
});

app.get('/processingDB', function(req, res){
	db.find({}, function(err, docs) {
		var biggestIndex = 1;
		var lastobjectIndex = 0;
	
		// Loop through the results, send each one as if it were a new chat message
		for (var i = 0; i < docs.length; i++) {
			//console.log(docs[i]);
			if (docs[i].index >= biggestIndex){
				biggestIndex = docs[i].index;
				lastobjectIndex = i;
			}
			//console.log(i);
			//console.log(docs[i]);
			// for (var j =0; j<docs[i].data.length;j++){
			// 	console.log(i+ ": "+docs[i].data[j]);
			// 	//storedData.push(docs[i][j]);
			// }
		}
		console.log("count: "+count);
		console.log("biggest: "+biggestIndex);
		console.log(docs[lastobjectIndex]);
		lastData = docs[lastobjectIndex];
		count++;
		
		res.redirect('/templateprocessing');
	});
});


app.get('/templateprocessing', function(req,res){
	var random = Math.floor(Math.random()*3);
	if (random == 0){
		res.render('template.ejs',lastData);
	} else if (random ==1){
		res.render('template-1.ejs',lastData);
	} else {
		res.render('template-2.ejs',lastData);
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