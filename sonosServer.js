var request = require('request');
var schedule = require('node-schedule');

/*
 var os = require('os');
 var interfaces = os.networkInterfaces();
 console.log(interfaces.eth0[0].mac);
 */

// This script is called every minute by a OS cron job.
// We loop this every second and close after 1 minute

var currentSecond = 0;

var firebaseUrl = "https://{YOUR FIREBASE INSTANCE}.firebaseio.com/0.json";

var mySchedule = schedule.scheduleJob('* * * * * *', function() {

	currentSecond++;
	if (currentSecond > 59) {
		mySchedule.cancel();
		console.log("Shutting down after 60 seconds");
	}

	console.log(currentSecond + " " + firebaseUrl);
	request(firebaseUrl, function (error, response, body) {
		console.log('error:', error);
		console.log('statusCode:', response && response.statusCode);
		console.log('body:', body);

		if (response && response.statusCode == 200) {

			var localUrl = "http://localhost:5005/" + body.substring(1, body.length - 1); // Trim '"'
			console.log(localUrl);

			request(localUrl, function (error, response, body) {
				console.log('error:', error);
				console.log('statusCode:', response && response.statusCode);
				console.log('body:', body);

				if (response && response.statusCode == 200) {

					var localUrl = "http://localhost:5005/" + body;
					console.log(localUrl);

					request.delete(firebaseUrl, function (error, response, body) {
						console.log('error:', error);
						console.log('statusCode:', response && response.statusCode);
						console.log('body:', body);
					});
				}
			});
		}
	});
});