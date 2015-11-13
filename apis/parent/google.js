var config = require("../../config"),
    https = require("https"),
    time = require("time");

exports.searchDistance = function(origin, destination, offset, next) {
    var options = {
    host: "maps.googleapis.com",
    path: "/maps/api/directions/json"
    };


    var offsetUTS = time.time() + offset*60;

    var query = "?origin=" + escape(origin) + "&destination=" + escape(destination) + "&departure_time=" + String(offsetUTS);
    query += "&key=" + config.google.api_key;
    options.path += query;

    https.get(options, function(res) {
        // console.log("Got response: " + res.statusCode);

        var body = "";

        res.on("data", function(chunk) {
            body += chunk;
        });

        res.on("end", function(){
            var response = JSON.parse(body);
            next(null, response);
        });
    }).on("error", function(e) {
        console.log("Got error: " + e.message);
        next(e, null);
    });
}