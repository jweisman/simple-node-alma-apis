var crypto = require('crypto');
var jwt = require('jsonwebtoken');

exports.validateSignature = function (body, secret, signature) {
	var hash = crypto.createHmac('SHA256', secret)
		.update(JSON.stringify(body))
		.digest('base64');
	return (hash === signature);
}

exports.validateJwt = function(token, secret) {
	return jwt.verify(token, secret);
}