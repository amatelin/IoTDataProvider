var Twitter = require("twitter"),
    config = require("../../config"),
    async = require("async");

var client = new Twitter(config.twitter);

exports.search = function(text, next) {
    var params = {q: text};
    client.get('search/tweets', params, function(error, tweets, response){
       // console.log(tweets);
       /*for (property in tweets["statuses"]) {
        console.log(tweets["statuses"][property].text)
       }*/
       next(null, tweets);
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
        if (!error) {
            next(null, tweets);
        }
    });
}

exports.globalSearch = function(text, next) {
  async.parallel([
      this.search.bind(null, "@"+text),
      this.userTimeline.bind(null, text)
    ], function(err, results) {
      next(results[0]["statuses"].concat(results[1]["statuses"]))
  });
}
