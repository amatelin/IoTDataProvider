var google = require("../parent/google"),
    helpers = require("./helpers");

exports.findTrafficOverhead = function(params, next) {
    var origin = params.origin,
        destination = params.destination,
        offset = params.offset;

    google.searchDistance(origin, destination, offset, function(error, res) {
        var transitTime = res.routes[0].legs[0].duration.value;
        var transitTimeWithTraffic = res.routes[0].legs[0].duration_in_traffic.value;

        var diffRatio = ((transitTimeWithTraffic-transitTime)/transitTime)*100;
        diffRatio = (diffRatio > 100 ? 100 : diffRatio);
        diffRatio = (diffRatio < 0 ? 0 : diffRatio);

        var green = {r:0, g:255, b:0},
            red = {r:255, g:0, b:0};

        var color = helpers.makeGradientColor(green, red, diffRatio);

        console.log(color);
        var out = String(color.r) + "," + String(color.g) + "," + String(color.b);

        next(null, out);
    });
};