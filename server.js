
// Actual server stuff
var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');

// MongoDB stuff
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/thosdaq');

// Utilities
var moment = require('moment');

// Init middleware
app.use(logger("tiny"));
app.use(bodyParser());

// -----------------------------------------------------
var LogSchema = new Schema({
    type: String,
    value: Number,
    author: String,
    date: { type: Date, default: Date.now },
    fingerprint: String,
    fakeCompany: String
});
var LogModel = mongoose.model('Log', LogSchema);



// Route handlers --------------------------------------
app.use(express.static(__dirname + '/app')); // static file hosting middleware

app.post('/log', function(req, res) {
    console.log("drink post");
    console.log(moment().format('HH:mm'));
    console.log(req.body);

    var newLog = new LogModel({
        type: req.body.type,
        value: 10
    });
    newLog.save();

    res.send(req.body);
});


// -----------------------------------------------------
// Launch server
var port = 3000;
var server = app.listen(port, function() {
    console.log("Server running :: http://localhost:" + port);
});

exports.server = server;
exports.app = app;
