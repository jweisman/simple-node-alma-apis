var express = require('express');
var router = express.Router();
var nconf = require('nconf');
var utils = require('../utils.js');

// Load configuration
nconf.env()
   .file({ file: './config.json' });

router.get('/', function(req, res, next) {
  res.redirect(`${nconf.get('alma_server')}/view/socialLogin?institutionCode=${nconf.get('institution')}&backUrl=${req.protocol}://${req.get('host')}/login/callback`);
});

router.get('/callback', function(req, res, next) {
	var payload = utils.validateJwt(req.query.jwt, nconf.get('jwt_secret'));
	req.session.username = payload.id;
	res.redirect('/');
});

router.get('/logout', function(req, res, next) {
	delete req.session.username;
	res.redirect('/');
});

module.exports = router;
