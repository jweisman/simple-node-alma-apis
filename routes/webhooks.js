var express = require('express');
var router = express.Router();
var nconf = require('nconf');
var utils = require('../utils.js')

// Load configuration
nconf.env()
   .file({ file: './config.json' });

/* 
GET - Challenge
*/
router.get('/', function(req, res, next) {
	res.json({ challenge: req.query.challenge });
});

/* 
POST - Handle webhook
*/
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
	switch (action) {
		default:
			console.log('No handler for type', action);
	}

	res.status(204).send();
});

module.exports = router;
