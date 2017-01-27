"use strict";

var express = require('express');
var router = express.Router();
var utils = require('../utils.js');
var dateFormat = require('dateformat');

// Load configuration
var nconf = require('nconf');
nconf.env()
   .file({ file: './config.json' });

router.get('/', function(req, res, next) {
	res.format({ 	
		// Handle webhook challenge
		html: () => {
			res.send(JSON.stringify({challenge: req.query.challenge}));
		},
		// Request from application
  	json: () => {
  		if (!req.session.username) return res.redirect('/');
  		getRecord(req.app.db, req.session.username, (err, record) => {
  			res.json(record.notifications);  			
  		});
  	}
	});
});

router.post('/', function(req, res, next) {
	console.log('Received webhook request:', JSON.stringify(req.body));

	// Validate signature
	var secret = nconf.get('webhook_secret');
	if (!utils.validateSignature(req.body, 
		secret, 
		req.get('X-Exl-Signature'))) {
		return res.status(401).send({errorMessage: 'Invalid Signature'});
	}

	// Handle webhook
	var action = req.body.action.toLowerCase();
	var body = req.body.notification_data;
	var username = body.receiver.primary_id;
	if (action == 'notification' && username) {
		var notification = {
			id: req.body.id,
			title: body.general_data.subject,
			body: body.sms_content,
			date: dateFormat(req.body.time, "d/mmm/yy HH:MM")
		};
		getRecord(req.app.db, username, function(err, record) {
			// Check to see if notification has already been handled
			if (!record.notifications.some(n=>n.id == notification.id)) {
				record.notifications.push(notification);
				updateRecord(req.app.db, record);
				req.app.emit('notificationReceived', {username: username, notification: notification});
			}
		});
	}
	res.status(204).send();
});

router.get('/clear', function(req, res, next) {
	updateRecord(req.app.db, {username: req.session.username, notifications: []});
	res.status(204).send();
});

function getRecord(db, username, callback) {
	var cursor = db.collection('notifications').find( { "username": username } );
	cursor.toArray(function(err, docs) {
		let record = docs[0];
		if (!record) record = {username: username, notifications: []};
		callback(err, record);
	});
}

function updateRecord(db, record) {
	console.log('trying to update record', record.username);
	db.collection('notifications').update(
		{"username": record.username}, record, { upsert: true }
	);
}

module.exports = router;
