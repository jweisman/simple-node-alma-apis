var express = require('express');
var router = express.Router();
var nconf = require('nconf');
var utils = require('../utils.js');

// Load configuration
nconf.env()
   .file({ file: './config.json' });

/* 
GET - Challenge
*/
router.get('/', function(req, res, next) {
	if (!req.session.username) 
		return res.redirect('/');
	res.format({
/*
		html: function() {
			res.render('notifications/index', 
  			{ title: 'Notifications', notifications: req.app.notifications[req.session.username] }
  		);
  	},
*/  	
  	json: function() {
  		res.json(req.app.notifications[req.session.username] || []);
  	}
	})
});

router.post('/', function(req, res, next) {
	console.log('Received webhook request:', JSON.stringify(req.body));

/*
	// Validate signature
	var secret = nconf.get('webhook_secret');
	if (!utils.validateSignature(req.body, 
		secret, 
		req.get('X-Exl-Signature'))) {
		return res.status(401).send({errorMessage: 'Invalid Signature'});
	}
*/

	// Handle webhook
	var action = req.body.action.toLowerCase();
	var username = req.body.notification_data.username;
	if (action == 'notification') {
		if (!(username in req.app.notifications)) {
			req.app.notifications[username] = [];
		}
		notification = {
			id: req.body.id,
			title: req.body.notification_data.title,
			body: req.body.notification_data.body,
			date: req.body.notification_data.date,
			username: username
		};

		req.app.notifications[username].push(notification);
		req.app.emit('notificationReceived', notification);
	}

	res.status(204).send();
});

/*
router.delete('/:id', function(req, res, next) {
	var id = req.params.id;
	var index = req.app.notifications[req.session.username].map(function(el) { return el.id; }).indexOf(id);	
	if (index > -1) req.app.notifications[req.session.username].splice(index,1); 
	res.status(204).send();
});
*/
router.get('/clear', function(req, res, next) {
	delete req.app.notifications[req.session.username];
	res.status(204).send();
});

module.exports = router;
