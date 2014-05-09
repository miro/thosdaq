
// Actual server stuff
var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');

// MongoDB stuff
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/thosdaq');
mongoose.set('debug', true);

// Utilities
var moment = require('moment');
var passwordHash = require('password-hash');

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

var UserSchema = new Schema({
    name: String,
    password: String
});
var UserModel = mongoose.model('User', UserSchema);


// Utility functions -----------------------------------
var validateUser = function(user, password) {

    UserModel.findOne({'name': user}, 'name password', function(error, result) {
        
        if (error) {
            console.log("ERROR in user authentication", ERR);
            return false;
        }

        if (result.length === 0) {
            console.log("no user found");
            return false;
        }

        if (passwordHash.verify(password, result.password)) {
            console.log("jeee");
            return result.user;
        }
        else {
            console.log("wrong password");
            return false;
        }
    });
};


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

app.post('/login', function(req,res) {
    console.log(req.body.password);
    var temp = validateUser(req.body.user, req.body.password);
    res.send(temp, 200);
});



// -----------------------------------------------------
// Launch server
var port = 3000;
var server = app.listen(port, function() {
    console.log("Server running :: http://localhost:" + port);
});

exports.server = server;
exports.app = app;
