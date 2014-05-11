
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

// Data
var fortune = require(__dirname + '/app/fortune500.json');

// Init middleware
app.use(logger("tiny"));
app.use(bodyParser());



// Mongoose Schema ---------------------------------------
var InvestmentSchema = new Schema({
    type: String,
    value: Number,
    author: String,
    timestamp: String,
    fingerprint: String,
    company: String,
    companyRank: Number,
    companyProfit: String
});
var InvestmentModel = mongoose.model('Investment', InvestmentSchema);

var UserSchema = new Schema({
    name: String,
    password: String
});
var UserModel = mongoose.model('User', UserSchema);



// Utility functions -----------------------------------
var validateUser = function(req, res, cb) {

    if (!req.body.user || !req.body.password) {
        console.log("# FAILED login", user, password);
        res.send("Invalid request", 400);
        return false;
    }
    
    var user = req.body.user;
    var password = req.body.password;

    UserModel.findOne({'name': user}, 'name password', function(error, result) {
        
        if (error) {
            cb(false);
        }

        else if (!result || result.length === 0) {
            cb(false);
        }

        else if (passwordHash.verify(password, result.password)) {
            console.log("User found, PW ok");
            cb(result);
        }
        else {
            res.send("wrong password", 401);
            cb(false);
        }
    });
};

var getRandomCompany = function() {
    var randomIndex = Math.floor(Math.random() * (499 - 0 + 1));
    return fortune.companies[randomIndex];
};


// Route handlers --------------------------------------
app.use(express.static(__dirname + '/app')); // static file hosting middleware

app.post('/invest', function(req, res) {
    var user = validateUser(req, res, function(result) {
        if (!result) {
            res.send("Logging error", 400);
        } else {

            var company = getRandomCompany();

            var newInvestment = new InvestmentModel({
                type: req.body.type,
                value: req.body.value,
                author: req.body.author,

                timestamp: new moment().toJSON(),

                company: company.Company,
                companyRank: parseInt(company.Rank, 10),
                companyProfit: company.Profit
            });
            newInvestment.save(function(error, newInvestment) {
                if (error) {
                    res.send("Error when saving to DB", 400);
                }
                console.log('INVESTMENT #', newInvestment.author, newInvestment.type, newInvestment.timestamp);
                res.json(200, newInvestment);
            });
        }
    });

    
});


app.post('/login', function(req,res) {
    var user = validateUser(req, res, function(user) {
        if (!user) {
            console.log(user);
            res.send("Authentication error", 401);
        }

        res.send("Authentication OK", 200);
    });
});



app.get('/invest', function(req, res) {
    res.send("This is the THOSDAQ-API", 200);
});

// -----------------------------------------------------
// Launch server
var port = 3000;
var server = app.listen(port, function() {
    console.log("Server running :: http://localhost:" + port);
});

exports.server = server;
exports.app = app;
