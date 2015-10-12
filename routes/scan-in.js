var express = require('express');
var router = express.Router();

var alma = require('../alma.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	alma.get('/conf/libraries', 
		function(data) {
  			res.render('scan-in/index', 
  				{ title: 'Scan In Item', libraries: data });			
		});
});

/* POST */
router.post('/', function(req, res, next) {
	alma.get('/items?item_barcode=' + req.body.barcode, 
		function(data) {
			if (req.body.scan) {
				alma.post(data.link + '?op=scan&library=' + req.body.library +
					'&circ_desk=' + req.body.circ_desk, null,
					function(data) {
						res.render('scan-in/index', 
							{ title: 'Scan In Item', item: data });
					});
			} else {
				res.render('scan-in/index',
					{ title: 'Scan In Item', item: data });
			}
		});
});

module.exports = router;
