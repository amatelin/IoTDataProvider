var Twitter = require("twitter"),
    config = require("../../config"),
    async = require("async");

// var client = new Twitter(config.twitter);

exports.search = function(params, next) {
  text = "@" + params.text;
  credentials = params.credentials;
  var client = new Twitter(credentials);
  var options = {q: text};
  client.get('search/tweets', options, function(error, tweets, response){
    if (!error&&response) {
      next(null, tweets);
    } else if (error) {
      console.log(error);
      next(error, response);
    } else {
      next("no tweets received", null);
    }

  });
}

exports.geoSearch = function(text, next) {
  var params = {query: text};
  client.get('geo/search.json', params, function(error, tweets, response){
    if (!error) {
      console.log(tweets);
      next(tweets);
    }
  });
}

exports.userTimeline = function(text, next) {
  var params = {screen_name: text}; 
  client.get('statuses/user_timeline.json', params, function(error, tweets, response){
    if (!error&&response) {
      next(null, tweets);
    } else if (error) {
      next(error, null);
    } else {
      next("no tweets received", null);
    }
  });
}

exports.globalSearch = function(params, next) {
  async.parallel([
      this.search.bind(null, params),
      // this.userTimeline.bind(null, text)
    ], function(err, results) {
      if (!err) {
        next(null, results[0]["statuses"]) //.concat(results[1]["statuses"]))        
      } else {
        next(err, null);
      }

  });
}
