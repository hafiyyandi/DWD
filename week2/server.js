var express = require('express');
var app = express();

var count=0;

app.use(express.static('public'));

app.get('/count', function (req, res) {
  count++;
  res.send("<html><body><h1>+"count+"</h1></body></html>");
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