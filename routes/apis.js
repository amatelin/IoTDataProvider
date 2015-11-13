var express = require("express"),
    router = express.Router(),
    mongoose = require("mongoose"),
    twitter = require("../apis/parent/twitter"),
    google = require("../apis/parent/google"),
    services = require("../apis/index");

/*
Mostly used for testing purposes.
*/
router.get("/", function(req, res) {

});

router.get("/twitter/search", function(req, res) {
    var query = req.query.query;
    var geocode = req.query.geocode
    console.log(query);
    twitter.search(query, geocode, function(response) {
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

router.get("/google", function(req, res) {
    var params = {origin :"4005 rue de Bordeaux",
                destination: "3890 rue Rivard" ,
                offset: 5};
    services.google.findTrafficOverhead(params,function() {
        res.send("caca");
    });
});


module.exports = router;