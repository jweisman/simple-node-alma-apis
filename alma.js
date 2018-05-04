var querystring = require('querystring');
var request = require('request');
var nconf = require('nconf');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var serializer = require('xmldom').XMLSerializer;

nconf.env()
   .file({ file: './config.json' });

var host = nconf.get('alma_host');
var path = nconf.get('alma_path');
var apikey = nconf.get('api_key');

function performRequestPromise(endpoint, method, data, contentType='json') {
  return new Promise(function (resolve, reject) {
    performRequest(endpoint, method, data, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    }, contentType);
  });
}

function performRequest(endpoint, method, data, callback, contentType='json') {
  var dataString;
  var headers = {
  	'Authorization': 'apikey ' + apikey,
  	'Accept': (contentType=='json' ? 
      'application/json' : 'application/xml') 
  };

  var options = {
    uri: (endpoint.substring(0,4) == 
      'http' ? '' : host + path) + endpoint,
    method: method,
    headers: headers,
  };

  if (method != 'GET') {
    if (contentType=='json') {
      dataString = JSON.stringify(data);
      headers['Content-Type'] = 'application/json';
    } else {
      dataString = new serializer().serializeToString(data);;
      headers['Content-Type'] = 'application/xml';
    }
    headers['Content-Length'] = dataString.length;
    options['body'] = dataString;
  }

  request(
  	options,
  	function(err, response, body) {
      try {
        var obj = (contentType=='json' ? 
          JSON.parse(body) : new dom().parseFromString(body));
        if (!err && ('' + response.statusCode).match(/^[4-5]\d\d$/)) {
          console.log('Error from Alma: ' + body);
          var message;
          try {
            if (contentType=='json') {
              message = obj.errorList.error[0].errorMessage + " (" + obj.errorList.error[0].errorCode + ")";
            } else {
              var select = xpath.useNamespaces({"alma": "http://com/exlibris/urm/general/xmlbeans"});
              message = select('/alma:web_service_result/alma:errorList/alma:error/alma:errorMessage', obj)[0]
                .firstChild.data;
            }
          } catch (e) {
            message = "Unknown error from Alma.";
          }
          err = new Error(message);
        }
      } catch (e) {
        err = new Error("Cannot parse response from Alma");
      }
  		if(err) callback(err);
  		else callback(null, obj);
  	});
}

exports.get = function(url, callback) {
	performRequest(url, 'GET', null, 
		function(err, data) {
      if (err) callback(err);
      else callback(null, data);
		});
};

exports.getp = function(url) {
  return performRequestPromise(url, 'GET', null);
}

exports.getXml = function(url, callback) {
  performRequest(url, 'GET', null, 
    function(err, data) {
      if (err) callback(err);
      else callback(null, data);
    }, 'xml');
};

exports.getXmlp = function(url) {
  return performRequestPromise(url, 'GET', null, 'xml');
}

exports.post = function(url, data, callback) {
	performRequest(url, 'POST', data, 
		function(err, data) {
      if (err) callback(err);
			else callback(null, data);
		});
};

exports.put = function(url, data, callback) {
  performRequest(url, 'PUT', data, 
    function(err, data) {
      if (err) callback(err);
      else callback(null, data);
    });
};

exports.putXml = function(url, data, callback) {
  performRequest(url, 'PUT', data, 
    function(err, data) {
      if (err) callback(err);
      else callback(null, data);
    }, 'xml');
};

exports.putXmlp = function(url, data) {
  return performRequestPromise(url, 'PUT', data, 'xml');
}

