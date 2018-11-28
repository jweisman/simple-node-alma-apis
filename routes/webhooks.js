var express = require('express');
var router = express.Router();
var nconf = require('nconf');
var crypto = require('crypto');

// Load configuration
nconf.env()
   .file({ file: './config.json' });

function validateSignature(body, secret, signature) {
	var hash = crypto.createHmac('SHA256', secret)
		.update(JSON.stringify(body))
		.digest('base64');
	return (hash === signature);
}

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
	var secret = nconf.get('WEBHOOK_SECRET');
	if (!validateSignature(req.body, 
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
