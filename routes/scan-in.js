var express = require('express');
var router = express.Router();
var async = require('async');

var alma = require('../alma.js');

function getLibraries(req, callback) {
	if (req.app.libraries) {
		callback(null, req.app.libraries);
	}
	else {
		alma.get('/conf/libraries', 
			function(err, data) {
				if (err) return callback(err);
				req.app.libraries = data;
				callback(null, data);
			});
	}
}

/* GET */
router.get('/', function(req, res, next) {
	getLibraries(req, 
		function(err, data) {
			if (err) return next(err);
  			res.render('scan-in/index', 
  				{ title: 'Scan In Item', libraries: data });	
  		}		
  	);
});

/* POST */
router.post('/', function(req, res, next) {
	var item, libraries;
	async.waterfall([
		function (callback) {
			getLibraries(req, callback);
		},
		function (data, callback) {
			libraries = data;
			alma.get('/items?item_barcode=' + req.body.barcode, callback)
		},
		function (item, callback) {
			if (req.body.scan) {
				res.cookie('prefs', 
					{ 
						library: req.body.library, 
						circ_desk: req.body.circ_desk
					}, 
					{ 	path: '/scan-in', 
						maxAge: 1000 * 60 * 60 * 24 * 7 
					});				
					
				alma.post(item.link + '?op=scan&library=' + req.body.library +
					'&circ_desk=' + req.body.circ_desk, null, callback);
			} else callback(null, item);
		}
	], 
	function (err, item) {
		if (err) {
			if (err.message.indexOf("401690") > 0 || err.message.indexOf("401689") > 0)
				return res.render('scan-in/index', 
					{ title: 'Scan In Item', error: "Invalid barcode", libraries: libraries });
			else return next(err);
		}
		res.render('scan-in/index',
			{ title: 'Scan In Item', item: item, libraries: libraries });		

	});
});

module.exports = router;
