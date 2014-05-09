

var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser')

app.use(logger("tiny"));
app.use(bodyParser());
app.use(express.static(__dirname + '/app')); // static file hosting middleware

// Mock route for mock data
app.get('/api/mock/:filename', function(req, res) {
	var fs = require('fs');
    var path = require('path');
    var filename = req.params.filename;

    if(!filename) {
        res.send({ msg: 'Filename must be specified' });
        return;
    }

    // Server must be started in project's root!
    fs.readFile(path.resolve(process.cwd(), 'mockdb/' + filename), function(error, file) {
        if(error) {
            res.send({ msg: 'Could not read ' + filename, error: error });
            return;
        }
        res.send(file);
    });
});



app.post('/drink', function(req, res) {
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
