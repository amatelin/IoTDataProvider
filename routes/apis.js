var express = require("express"),
    router = express.Router(),
    mongoose = require("mongoose"),
    twitter = require("../apis/parent/twitter"),
    services = require("../apis/index"),
    Credential = mongoose.model("Credential");

/*
Mostly used for testing purposes.
*/
router.get("/", function(req, res) {

});

router.get("/twitter/search", function(req, res) {
    var query = req.query.query;
    var geocode = req.query.geocode
    console.log(query);
    twitter.search(query, function(err, response) {
        res.json(response);
    });
});

router.get("/twitter/geoSearch", function(req, res) {
    var query = req.query.query
    twitter.geoSearch(query, function(response) {
        res.json(response);
    });
});

router.get("/twitter/timeline", function(req, res) {
    var query = req.query.query
    twitter.userTimeline(query, function(response) {
        res.json(response);
    });
});

router.get("/twitter/findColorCode", function(req, res) {
    var twitter_handle = req.query.user;
    var hashtag = req.query.tag;

    services.twitter.findColorCode(twitter_handle, hashtag, function(tweets) {
        res.json(tweets);
    });
});

router.get("/twitter/globalSearch", function(req, res) {
    var query = req.query.query
    twitter.globalSearch(query, function(response) {
        res.json(response);
    });
});

router.post("/twitter/credentials", function(req, res) {
    var user_id = req.body.user_id;
    var consumerKey = req.body.consumerKey;
    var consumerSecret = req.body.consumerSecret;
    var tokenKey = req.body.tokenKey;
    var tokenSecret = req.body.tokenSecret;

    Credential.findById(user_id, function(err, credential) {
        if (err) {

        } else if (credential) {
            credential.consumer_key = consumerKey;
            credential.consumer_secret = consumerSecret;
            credential.access_token_key = tokenKey;
            credential.access_token_secret = tokenSecret;
            credential.save(credential, function(err, credID){
                if (err) {
                    console.log(err);
                } else {
                    console.log("success");
                }
                res.redirect("/settings");
            })

        } else {
            Credential.create({
                _id: user_id,
                consumer_key: consumerKey,
                consumer_secret: consumerSecret,
                access_token_key: tokenKey,
                access_token_secret: tokenSecret
            }, function(err, CredID) {
                res.redirect("/settings");
            });
        }
    });
}); 

module.exports = router;