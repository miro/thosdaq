// MongoDB stuff
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/thosdaq');
mongoose.set('debug', true);
var db = require(__dirname + '/db-models.js');

// Utilities
var moment 	= require('moment');
var _ 		= require('underscore');

// "Globals"
var indexStartingPoint = new moment('2014-05-22');

// "main" -----------------------------
var calculateIndexPoint = function(latestIndexPoint) {
	var latestTimestamp = latestIndexPoint ? latestIndexPoint.timestamp : indexStartingPoint.toJSON();

	db.InvestmentModel.find({timestamp: {$gte: latestTimestamp}}, function(err, data) {
		if (err) {
			console.log('Error while retrieving Investments:', err);
			return false;
		}

			
		if (!latestIndexPoint) {
			// Create the "seed"-index
			latestIndexPoint = new db.InvestmentIndexModel({
				timestamp: indexStartingPoint.toJSON(),
				indexPoints: 1000,
				indexMultiplier: 1.0,
				samples: 0
			});
		}
		else if (moment(latestIndexPoint.timestamp).isAfter(moment())) {
			console.log("No need to run THOSDAQ generator right now -> exit");	
			process.exit(0);
		}
	
		// Time range
		var timerange = getNextTimeRange(latestIndexPoint.timestamp);
	
		// Create base for new index point	 
		var newIndexPoint = new db.InvestmentIndexModel({
			timestamp: timerange.from.toJSON(),
			indexPoints: latestIndexPoint.indexPoints,
			indexMultiplier: latestIndexPoint.indexMultiplier,
			samples: 0
		});

		// go through all the investments
		_.each(data, function(investment) {
			var timestamp = moment(investment.timestamp);
			if (timestamp.isAfter(timerange.from) && timestamp.isBefore(timerange.to)) {
				newIndexPoint.indexPoints = newIndexPoint.indexPoints + investment.value;
				newIndexPoint.samples = newIndexPoint.samples + 1;
			}
		});

		// Increase multiplier if conditions match
		if (newIndexPoint.samples > 0 && newIndexPoint.samples >= latestIndexPoint.samples) {
			newIndexPoint.indexMultiplier = newIndexPoint.indexMultiplier + 0.1;
		}
		else {
			newIndexPoint.indexMultiplier = newIndexPoint.indexMultiplier - 0.1;
			newIndexPoint.indexMultiplier = newIndexPoint.indexMultiplier < 1.0 ? 1.0 : newIndexPoint.indexMultiplier;
		}

		// Apply the multiplier
		newIndexPoint.indexPoints = Math.ceil(newIndexPoint.indexPoints * newIndexPoint.indexMultiplier);

		// Make the decrease
		newIndexPoint.indexPoints = Math.ceil(newIndexPoint.indexPoints * 0.95);

		// Keep index at 1000
		if (newIndexPoint.indexPoints < 1000) {
			newIndexPoint.indexPoints = 1000;
		}

		console.log("Index value ", newIndexPoint.indexPoints, " samples ", newIndexPoint.samples, " timestamp ", newIndexPoint.timestamp);

		newIndexPoint.save(function(err, result) {
			if (err) {
				console.log("Error while saving new index point: ", err);
				return;
			}

			else if (moment(result.timestamp).add('minutes', 15).isBefore(new moment())) {
				calculateIndexPoint(result);
			}
			else {
				process.exit(0);
			}
		});
	});
};


db.InvestmentIndexModel.findOne({}, {}, { sort: { 'timestamp' : -1 } }, function(err, model) {
	if (err) {
		console.log("Error while starting calculation");
	}
	else {
		calculateIndexPoint(model);
	}
});


// Utilities--------------------------------------
var getNextTimeRange = function(timestamp) {
	var momentTime = moment(timestamp);
	var r = {
		from: momentTime.minutes(Math.round(momentTime.minutes() / 15) * 15).add('minutes', 15), // Set to nearest 15mins
		to: momentTime.clone().add('minutes', 15)
	};

	return r;
};