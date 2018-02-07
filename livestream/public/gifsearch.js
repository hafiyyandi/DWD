var Datastore = require('nedb');
var db = new Datastore({filename: "../data.db", autoload: true});
var searchterms = [];

let gifURL1 = "https://api.giphy.com/v1/gifs/random?tag=anarchy&api_key=uFczQQnDIgNYChtFQetHrpON63UOnlk3";
let gifURL2 = "https://api.giphy.com/v1/gifs/random?tag=conspiracy&api_key=uFczQQnDIgNYChtFQetHrpON63UOnlk3";
let gifURL3 = "https://api.giphy.com/v1/gifs/random?tag=puberty&api_key=uFczQQnDIgNYChtFQetHrpON63UOnlk3";

let breitURL1 = "https://newsapi.org/v2/everything?q=anarchy&sources=breitbart-news&apiKey=a7fd0e145ee34528b8ad6d56419d6be4"
let breitURL2 = "https://newsapi.org/v2/everything?q=conspiracy&sources=breitbart-news&apiKey=a7fd0e145ee34528b8ad6d56419d6be4"
let breitURL3 = "https://newsapi.org/v2/everything?q=puberty&sources=breitbart-news&apiKey=a7fd0e145ee34528b8ad6d56419d6be4"



window.onload = function(){
  db.find({}, function(err, docs){
    console.log("err: " + err);
    for (var i=0; i<docs.length; i++){
      for (var j=0; docs[i].length;j++){
        console.log("search term: "+ docs[i][j]);
        searchterms.push(docs[i][j]);
      }
    }
  });
  
  document.getElementById("title").innerHTML = 
    searchterms[0] + ", " +
    searchterms[1] + ", & " +
    searchterms[2];

  var giphyURL = "https://api.giphy.com/v1/gifs/random?api_key=uFczQQnDIgNYChtFQetHrpON63UOnlk3&tag="
  gifURL1 = giphyURL+searchterms[0];
  gifURL2 = giphyURL+searchterms[1];
  gifURL3 = giphyURL+searchterms[2];

  var breitbartURL = "https://newsapi.org/v2/everything?sources=breitbart-news&apiKey=a7fd0e145ee34528b8ad6d56419d6be4&q="
  breitURL1 = breitbartURL + searchterms[0];
  breitURL2 = breitbartURL + searchterms[1];
  breitURL3 = breitbartURL + searchterms[2];

  startLoad();
};

function setup(){
}

function startLoad() {
  loadJSON(gifURL1, giphyLoaded1);
  loadJSON(breitURL1, breitLoaded1);

  loadJSON(gifURL2, giphyLoaded2);
  loadJSON(breitURL2, breitLoaded2);

  loadJSON(gifURL3, giphyLoaded3);
  loadJSON(breitURL3, breitLoaded3);
}

function giphyLoaded1(respObj) {
  let imgsrc = respObj.data.image_original_url;
  document.getElementById("image1").src = imgsrc;
}

function breitLoaded1(respObj) {
  let i = int(random(0,4));
  let url = respObj.articles[i].url;
  document.getElementById("link1").href = url;
}

function giphyLoaded2(respObj) {
  let imgsrc = respObj.data.image_original_url;
  document.getElementById("image2").src = imgsrc;
}

function breitLoaded2(respObj) {
  let i = int(random(0,4));
  let url = respObj.articles[i].url;
  document.getElementById("link2").href = url;
}

function giphyLoaded3(respObj) {
  let imgsrc = respObj.data.image_original_url;
  document.getElementById("image3").src = imgsrc;
}

function breitLoaded3(respObj) {
  let i = int(random(0,4));
  let url = respObj.articles[i].url;
  document.getElementById("link3").href = url;
}

  