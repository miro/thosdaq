#!/usr/bin/env node

/**
	A tiny mock server for developing the Kassakone frontend.
	
	Start server:
		./server.js
		node server.js
*/

var express = require('express');
var app = express();
var logger = require('morgan');

// Logs HTTP requests to console
app.use(logger("tiny"));

// Configure static file hosting middleware
app.use(express.static(__dirname + '/app'));

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

// Launch server
var port = 3000;
var server = app.listen(port, function() {
	console.log("Server running :: http://localhost:" + port);
});

exports.server = server;
exports.app = app;
