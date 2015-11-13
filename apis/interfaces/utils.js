exports.randomInt = function(params, next) {
/*
Params : 
        - min: lower range limit unsigned int
        - max: upper range limit unsigned int
Returns a random unsigned integer between min and max(inclusive)
*/
    var value = Math.floor(Math.random()*(params.max-params.min+1)+params.min);
    var str = "" + value;
    console.log(str)
    var pad = "00"
    var paddedValue = pad.substring(0, pad.length - str.length) + str
    return next(null, paddedValue);
}
