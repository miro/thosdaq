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


module.exports = {
    UserModel: UserModel,
    InvestmentModel: InvestmentModel
}