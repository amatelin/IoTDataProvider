var mongoose = require("mongoose");

var credentialSchema = new mongoose.Schema({
    consumer_key: {type: String, required: true},
    consumer_secret: {type: String, required: true},
    access_token_key: {type: String, required: true},
    access_token_secret: {type: String, required: true},
    created_at: {type:Date, default: Date.now}
});

mongoose.model("Credential", credentialSchema);