twitter = require("./twitter");

exports.findMode = function(params, next) {
    twitter.findKeyValue(params, function(err, value) {
        if (!err) {
            var code = -1;
            console.log(value);
            if (value) {
                var clean_val = value.toLowerCase();
                if (clean_val == "auto") {
                    code = 1;
                } else if (clean_val == "manual") {
                    code = 2;
                }
            }

            return next(null, code);
        } else {
            return next(err, null);
        }
    });

}

exports.findLEDMode = function(params, next) {
    twitter.findKeyValue(params, function(err, value) {
        if (!err) {
            var code = -1;
            console.log(value);

            if (value) {
                var clean_val = value.toLowerCase();
                if (clean_val == "sound") {
                    code = 1;
                } else if (clean_val == "rainbow") {
                    code = 2;
                } else if (clean_val == "color") {
                    code = 3;
                }
            }

            if (code == 3) {
                twitter.findColorCode({user:params.user, hashtag: params.colorHashtag}, function(err, value) {
                    return next(null, code + "," + value);
                });
            } else {
                return next(null, code);            
            }

        } else {
            return next(err, null);
        }
    });
}

exports.findAction = function(params, next) {
    twitter.findKeyValue(params, function(err, value) {
        if (!err) {
            var code = -1;
            console.log(value);
            if (value) {
                var clean_val = value.toLowerCase();
                if (clean_val == "animate") {
                    code = 1;
                } else if (clean_val == "open") {
                    code = 2;
                } else if (clean_val == "close") {
                    code = 3;
                } else if (clean_val == "play") {
                    code = 4;
                }               
            }            

            return next(null, code);
        } else {
            return next(err, null);
        }
    });
}