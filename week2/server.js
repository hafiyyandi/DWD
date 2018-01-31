var express = require('express');
var app = express();

var count=0;

var submissions = [];

app.use(express.static('public'));

app.get('/count', function (req, res) {
  count++;
  res.send("<html><body><h1>"+count+"</h1></body></html>");
});

app.get('/formpost', function (req, res){
	submissions.push(req.query.textfield);
	res.redirect('/display');
});

app.get('/display', function(req, res){
	var htmlout = "<html><body";
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