

var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser')

app.use(logger("tiny"));
app.use(bodyParser());
app.use(express.static(__dirname + '/app')); // static file hosting middleware


app.post('/log', function(req, res) {
    console.log("drink post");
    console.dir(req.body);
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
