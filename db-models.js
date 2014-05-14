// Connect to DB
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// THOSDAQ Schema ---------------------------------------
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


var InvestmentIndexSchema = new Schema({
    timestamp: String,
    indexPoints: Number, // Integer
    indexMultiplier: Number, // Float
    samples: Number // amount of investment on this timeframe
});
var InvestmentIndexModel = mongoose.model('InvestmentIndex', InvestmentIndexSchema);


module.exports = {
    UserModel: UserModel,
    InvestmentModel: InvestmentModel,
    InvestmentIndexModel: InvestmentIndexModel
}