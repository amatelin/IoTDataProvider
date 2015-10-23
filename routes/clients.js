var express = require("express"),
    router = express.Router(),
    hat = require("hat"),
    mongoose = require("mongoose"),
    Client = mongoose.model("Client"),
    Credential = mongoose.model("Credential"),
    hat = require("hat"),
    async = require("async"),
    apis = require("../apis/index"),
    helper = require("../utils");


router.get("/new", function(req, res) {
    console.log(apis);
    res.render("clients/new", {apis_list:apis});
});

router.get("/:id/edit", function(req, res) {
    Client.findOne({_id: req.params.id}, function(err, client) {
        res.render("clients/edit", {client: client, 
                                    apis_list: apis});
    });
});

router.get("/payload", function(req, res) {
    var api_key = req.query.key;

    Client.findOne({api_key: api_key}, function(err, client) {
        Credential.findById(client._id, function(err, credentials) {
            var async_queue = []; // Stores all the methods specified in the payload and passes them to async

            for (var i = 0; i<client.payload.length; i++) {
                var api_provider = Object.keys(client.payload[i])[0]
                var api_method = client.payload[i][api_provider].method
                var api_method_options = client.payload[i][api_provider].option
                api_method_options.credentials = credentials;
                // Bind arguments to the corresponding method and add to list of functions
                // that will be executed by async
                var method = apis[api_provider][api_method].bind(null, api_method_options);

                async_queue.push(method); 
            }
            // Execute all methods from payload in parralel
            // return result as a string containing every returned values
            // separated by ','
            async.parallel(async_queue, function(err, results) {
                    if (!err) {
                        outString = "";

                        for (i in results) {
                            outString += (i<(results.length-1) ? (results[i] + ",") : results[i]) 
                        }

                        res.json(outString);                    
                    } else {
                        console.log(err);
                        res.sendStatus(-1);
                    }

                }
            );
        });
    });
});

// POST request to update API key
router.post("/update/key", helper.authenticate, function(req, res) {
    var redirectUrl = req.headers.referer; // used to redirect to client edit page
    // Get values from the POST request
    var id = req.body.id;

    // Find client by ID 
    Client.findById(id, function(err, client) {
        if (err) {
            console.log("Error retrieving client: " + err);
            req.session.error = "A problem occured finding the client";
            res.redirect(redirectUrl);
        } else {
            // Update dataset with new key
            client.update({api_key: hat()}, function(err, clientID) {
                res.redirect(redirectUrl);
            });
        }
    });
});

/* CRUD API */
// Create - POST
router.post("/", function(req, res, next) {
    // Get values from POST request
    var name = req.body.name;
    // In case only a single method was set, wrap in list
    var apis = ((typeof(req.body.payloadApi) == 'string') ? [req.body.payloadApi] : req.body.payloadApi);
    var apiMethods = ((typeof(req.body.payloadMethod) == 'string') ? [req.body.payloadMethod] : req.body.payloadMethod);
    var apiOptions = ((typeof(req.body.payloadOption) == 'string') ? [req.body.payloadOption] : req.body.payloadOption);

    var payload = [];
    // Build payload from form info
    for (var i=0; i<apis.length; i++) {
        payloadComponent = {};
        payloadComponent[apis[i]] = {};
        payloadComponent[apis[i]].method = apiMethods[i];
        payloadComponent[apis[i]].option = eval('({' + apiOptions[i] + '})');
        
        payload.push(payloadComponent);
    }
    // Create new client document
    Client.create({
        name: name, 
        api_key: hat(),
        owner_name: req.session.user.name,
        payload: payload
    }, function(err, client) {
        if (err) {
            console.log("Error creating new client: " + err);
            res.send("Error creating new client.");
        } else {
            console.log("POST creating new client: " + client);
            res.redirect("index");
        }
    })
});

// Retreive by ID - GET
router.get("/:id", function(req, res){
    // Find client document by id
    Client.findById(req.params.id, function(err, client){
        if (err) {
            console.log("Error retrieving client " + err);
            res.send("Error retrieving client.");
        } else {
            console.log("GET client with ID: " + client._id);
            res.json(client);
        }
    });
});

// Update by ID - PUT
router.put("/:id/edit", function(req, res) {
    // Get values from POST request
    var name = req.body.name;
    // In case only a single method was set, wrap in list
    var apis = ((typeof(req.body.payloadApi) == 'string') ? [req.body.payloadApi] : req.body.payloadApi);
    var apiMethods = ((typeof(req.body.payloadMethod) == 'string') ? [req.body.payloadMethod] : req.body.payloadMethod);
    var apiOptions = ((typeof(req.body.payloadOption) == 'string') ? [req.body.payloadOption] : req.body.payloadOption);

    var payload = [];
    // Build payload from form info
    for (var i=0; i<apis.length; i++) {
        payloadComponent = {};
        payloadComponent[apis[i]] = {};
        payloadComponent[apis[i]].method = apiMethods[i];
        payloadComponent[apis[i]].option = eval('({' + apiOptions[i] + '})');
        
        payload.push(payloadComponent);
    }

    Client.findById(req.params.id, function(err, client) {
        client.update({name:name, payload: payload}, 
            function(err, client) {
                if (err) {
                    console.log("Error updating client: " + err);
                    res.send("Error updating client.");
                } else {
                    console.log("PUT updating client: " + client._id);
                    res.redirect("/index");
                }    
        });
    });
});

// Delete by ID - DELETE
router.delete("/:id", function(req, res) {
    // Find client document by id
    Client.findById(req.params.id, function(err, client){
        if (err) {
            console.log("Error retrieving client " + err);
            req.session.error = "A problem occured retrieving the client.";
            res.redirect("/index");
        } else {
            // Remove client document
            client.remove(function(err, client){
                if (err) {
                    console.log("Error deleting the client " + err);
                    req.session.error = "A problem occured deleting the client.";
                    res.redirect("/index");
                } else {
                    console.log("DELETE client with ID: " + client._id);
                    res.redirect("/index");
                }
            });
        }
    });
});



module.exports = router;