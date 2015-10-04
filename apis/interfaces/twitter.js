var twitter = require("../parent/twitter.js");

exports.findKeyValue = function(params, next) {
/*
Params : 
        - user: username of timeline in which to search
        - hashtag: marker that will precede the value we're looking for
Will look in the *user*'s timeline for the last tweet marked with the provided 
*hashtag* and returns the following value. The format of the tweet must be:
'#hashtag1 : value1, #hashtag2, value2' etc.
Parameters are stored in an object so that we can standardized the calls to the function.
*/    
    var user = params.user;
    var hashtag = params.hashtag;

    twitter.globalSearch(user, function(err, tweets) {
        if (!err) {
                try {
                    loop1 : for (i in tweets) { // iterate through the tweets from last to oldest
                        var text = tweets[i]["text"]; // Get text from the tweet
                        var split_text = text.split(","); //split at sep if multiple arguments

                        loop2 : for (j in split_text) { // iterate through split text
                            if (split_text[j].indexOf(hashtag) > -1) { // if hashtag found in text, 
                                var pair = split_text[j].split(":"); // split at ':' to get value pair
                                var value = pair[1].replace(/ /g,''); // strip whitespace
                                // console.log(pair);
                                break loop1; // break out of the loop to return result
                            }
                        }
                    }
                    return next(null, value); // pass value to callback    
                } catch(err) {
                    return next(err, null);
                }        
        } else {
            return next(err, null);
        }
    });
}

exports.findColorCode = function(params, next) {
/*
Will use 'findKeyValue' to search the *user*'s timeline and return a color code
following a provided hashtag. 
The input color code must be in hexadecimal format, the output will be a string
containing the 3 values separated by "," and padded with 0s if the value is <100.
*/
    var hexColorCode;
    exports.findKeyValue(params, function(err, value) {
            if (!err) {
                console.log(value)
                rgbColorCode = hexToRgb(value);
                stringColorCode = "";
                for (i in rgbColorCode) {
                    var str = "" + rgbColorCode[i];
                    var pad = "000"
                    var ans = pad.substring(0, pad.length - str.length) + str
                    stringColorCode += (i < (rgbColorCode.length-1) ? (ans + ",") : ans);                    
                }
                return next(null, stringColorCode);                
            } else {
                return next(err, null);
            }

    }); 
}



function hexToRgb(hex) {
/*
Source : stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
*/
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}
