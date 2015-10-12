var querystring = require('querystring');
var request = require('request');
var nconf = require('nconf');

nconf.env()
   .file({ file: './config.json' });

var host = nconf.get('alma_host');
var path = nconf.get('alma_path');
var apikey = nconf.get('api_key');

function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {
  	'Authorization': 'apikey ' + apikey,
  	'Accept': 'application/json'
  };
  
  if (method != 'GET') {
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = dataString.length;
  }

  var options = {
    uri: (endpoint.substring(0,4) == 
    	'http' ? '' : host + path) + endpoint,
    method: method,
    headers: headers
  };

  request(
  	options,
  	function(error, response, body) {
  		if(error) console.log(error);
  		else if (('' + response.statusCode).match(/^[4-5]\d\d$/))
  			throw new Error('Error from server: ' + response.statusCode + 
  				' / ' + body);
  		else success(body);
  	});
}

exports.get = function(url, success) {
	performRequest(url, 'GET', null, 
		function(data) {
			success(JSON.parse(data));
		});
};

exports.post = function(url, data, success) {
	performRequest(url, 'POST', data, 
		function(data) {
			success(JSON.parse(data));
		});
};


