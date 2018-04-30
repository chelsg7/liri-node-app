// REQUIRED NPM PACKAGES AND OTHER NEEDED DOCUMENTS
require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var request = require("request");
var fs = require("fs"); 

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userInput = process.argv[2];
var arrInput = [];
var inputStr = ""


var userFunction = function (){
    for (i = 3; i < process.argv.length; i++ ){
        arrInput.push(process.argv[i]);
    }
    for (i = 0; i < arrInput.length; i++ ){
        inputStr += arrInput[i] + " ";
    };
};


var runSpotify = function (){
    if (process.argv.length <= 3 && userInput === "spotify-this-song"){
        var song = "the+sign+ace+of+base";
    } else {
        var song = inputStr;
    }
    
    spotify.search({type:"track", query: song}, function(error,data){
        if(error){
            console.log("PROBLEM: " + error);
        }
        console.log("SONG TITLE : " + data.tracks.items[0].name);
        console.log("SONG ARTIST : " + (data.tracks.items[0].album.artists[0].name));
        console.log("SONG ALBUM TITLE : " + data.tracks.items[0].album.name);
        console.log("SONG SPOTIFY LINK : " + data.tracks.items[0].album.external_urls.spotify);
    
    });
};

var runOMDB = function (){
    if (process.argv.length<=3){
        var movie = "Mr.Nobody"; //if no user specified movie, default is "Mr. Nobody"
    }else{
        var movie = inputStr;
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    
    request(queryUrl, function(error, response, body){ //request to gather info from the api, logs it to the user
        if(!error && response.statusCode === 200){
            console.log("MOVIE TITLE : " + JSON.parse(body).Title);
            console.log("MOVIE RELEASED : " + JSON.parse(body).Year);
            console.log("MOVIE PLOT : " + JSON.parse(body).Plot);
            console.log("MOVIE CAST : " + JSON.parse(body).Actors);
            console.log("MOVIE COUNTRY : " + JSON.parse(body).Country);
            console.log("MOVIE LANGUAGE : " + JSON.parse(body).Language);
            console.log("MOVIE IMDB RATING: " + JSON.parse(body).imdbRating);
            console.log("MOVIE ROTTEN TOMATOES RATING : " + JSON.parse(body).Ratings[1].Value);
        }
    });
}

var runTwitter = function (){
    // var queryURL = "https://api.twitter.com/1.1/search/tweets.json?q=nyx_the_grey&src=typd"
    var params = {screen_name: 'Mr_ThorDog'};
    client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error){
            console.log("@Mr_ThorDog:")
            for (var i=0; i<20; i++){
                console.log((i+1) + ". " + tweets[i].text);
            };
        } else {
            console.log("PROBLEM: " + error);
        }
    });
}


userFunction(); 

if (userInput === "spotify-this-song") {
    runSpotify();
} else if  (userInput === "movie-this") {
    runOMDB();
} else if (userInput === "my-tweets") {
    runTwitter();
} else if (userInput === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) {
            console.log("PROBLEM: " + error);
        }
        
        var dataArr = function () {
            data.split(",");
            for (i = 0; i < dataArr.length; i++){

            }
        };
        dataArr();
        
        if (dataArr[0] === "spotify-this-song") {
            inputStr = dataArr[1];
            runSpotify();
        } else if (dataArr[0] === "movie-this") {
            inputStr = dataArr[1];
            runOMDB();
        } else if  (dataArr[0] === "my-tweets") {
            inputStr = dataArr[1];
            runTwitter();
        } else {
            console.log("Invalid Input.");
        }
    });
}else{
    console.log("Invalid Input.")
};
