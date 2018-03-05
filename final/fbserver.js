// Facebook API module
// https://criso.github.io/fbgraph/
// npm install fbgraph
var graph = require('fbgraph');

// Facebook App: https://developers.facebook.com/apps/
var fb_appID = '294044474454157';
var fb_secret = 'f9dcea4f26de12de01a9c6621fdf5cfb';

// All of the permissions that you want access to:
// https://developers.facebook.com/docs/facebook-login/permissions
var fb_scope = 'public_profile,email,user_videos,user_posts';

// More OAuth nonsense
// Don't forget to change "localhost" to your server
var loginRedirectUrl = "http://165.227.205.200/loggedin";

// get FB authorization url
var authUrl = graph.getOauthUrl({
	"client_id": fb_appID
	, "redirect_uri": loginRedirectUrl
	, "scope": fb_scope
});

// Express 
var express = require('express');
var app = express();

var count = 1;
var commentInterval;

app.listen(80, function () {
  console.log('Server listening on port 80!');
});

//for MongoDB
var mongojs = require('mongojs');
var config = require('./config.js');
var db = mongojs(config.mlabstring, ["submissions"]);

var accessToken;

//Templates
app.set('view engine', 'ejs');

//For public directory files
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.redirect('/index.html');
});

// OAuth2 Implementation - Redirect to FB login
app.get('/login', function (req, res) {
	console.log("redirecting to: " + authUrl);
	res.redirect(authUrl);
});

// var options = {
//     timeout:  1000
//   , pool:     { maxSockets:  Infinity }
//   , headers:  { connection:  "keep-alive" }
// };

// FB redirected here after successful login
app.get('/loggedin', function (req, res) {
	// Access Code from Facebook
	console.log("Access Code: " + req.query.code);
	
	// Now "hit" Facebook again with "code" to get "Access Token"
	// Using the graph.authorize function to do this
	graph.authorize({
		"client_id":      fb_appID
	  , "redirect_uri":   loginRedirectUrl
	  , "client_secret":  fb_secret
	  , "code":           req.query.code
	}, function (err, facebookRes) {

		if (err) console.log(err);
		
		// Got the access token			
		console.log("Access Token: " + facebookRes.access_token);
		graph.setAccessToken(facebookRes.access_token);
		accessToken= facebookRes.access_token;

		// At this point it probably makes more sense to set the access token into a user session or the like so that the user doesn't have to authenticate every time and that we keep a different one for each user.

		// Do something like get all of the user's likes.  
//You can use any of the "Graph API" calls as long as you have permission: https://developers.facebook.com/docs/graph-api/reference/
		/** CHANGE THIS PART!!**/
		graph.get('/me/live_videos', function(err, liveVids) { 

			// for (var i=0; i<liveVids.data.length; i++){
			// 	if (liveVids.data[i].status == 'LIVE'){
			// 		var id = liveVids.data[i].id;
			// 		var url = id + '/comments';
			// 		graph.get(url, function (err, resp){
			// 			console.log('video: ' +id);
			// 			console.log(resp);
			// 		});
			// 		break;
			// 	}
			// }
			
			res.render('vidlist.ejs', {liveVids:liveVids});
			
		});
		
	});	
});

app.get('/find', function(req,res){
	var id = req.query.liveVideoID;

	db.submissions.find({liveVideoID:id}, function(err, saved) {
    	if (err || !saved) {
    		console.log("No results");
    	}
    	else {

      		console.log(saved);
      		if (saved != ""){
      			//console.log("HELLOOOO");
      			res.render('displaycomments.ejs', {data:saved});
      			//res.send(saved);
      		} else {
      			//res.status(404).send('Sorry, the comments have not been recorded!');
      			//res.render('displaycomments.ejs', {data: [{liveVideoID:0}]});
      			res.redirect('/notfound.html')
      		}
    	}
  	});
});

app.get('/updatefind', function(req,res){
	var id = req.query.liveVideoID;

	db.submissions.find({liveVideoID:id}, function(err, saved) {
    	if (err || !saved) {
    		console.log("No results");
    	}
    	else {
      		//console.log(saved);
      		//res.render('displaycomments.ejs', {data:saved});
      		res.send(saved);
    	}
  	});
});

app.get('/track', function (req, res) {
	var id = req.query.liveVideoID;
	var getURL = id+'/comments?order=reverse_chronological&limit=500';
	//var getURL = id+'/comments?order=reverse_chronological';
	getLiveComments(getURL, id);
	
	db.submissions.find({liveVideoID:id}, function(err, saved) {
    	if (err || !saved) {
    		console.log("No results");
    	}
    	else {

      		console.log(saved);
      		if (saved != ""){
      			//console.log("HELLOOOO");
      			res.render('trackcomments.ejs', {data:saved});
      			//res.send(saved);
      		} else {
      			//res.status(404).send('Sorry, the comments have not been recorded!');
      			//res.render('displaycomments.ejs', {data: [{liveVideoID:0}]});
      			res.redirect('/notfound.html')
      		}
    	}
  	});
});

function getLiveComments(url, id){
	commentInterval = setInterval(function(){
		graph.setAccessToken(accessToken);
		graph.get(url, function(err, resp) { 
			//console.log(resp.data[0].message);
			//console.log(resp);
			//console.log(resp.data.length);

			//var index=0;

			for (var i=0; i<resp.data.length; i++){
				var commentID = resp.data[i].id;
				var commentMessage = resp.data[i].message;
				var culpritName = resp.data[i].from.name;
				var culpritID = resp.data[i].from.id;
				//console.log ("index: "+i);
				//console.log ("comment: "+commentMessage);

				db.submissions.save({
				"_id":commentID,
				"liveVideoID": id,
				"commentMessage": commentMessage,
				"culpritName" : culpritName,
				"culpritID": culpritID
				}, function(err, saved) {
					if( err || !saved ) console.log("Not saved");
					//else console.log("comment saved...iteration: "+count);
				});
			}
			
		});
		count++;
		console.log("comment saved...iteration: "+count);
	},500);

}

app.get('/stop', function(req,res){
	clearInterval(commentInterval);
});