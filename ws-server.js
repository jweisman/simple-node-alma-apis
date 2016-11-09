var WSServer = require('ws').Server;
var server = require('http').createServer();
var Emitter = require('events').EventEmitter, event = new Emitter();
var app = require('./app');

// Create web socket server on top of a regular http server
var wss = new WSServer({
  server: server
});

var clients = [];

// Also mount the app here
server.on('request', app);
wss.on('connection', function connection(ws) {

  var username;
  sessionParser(ws.upgradeReq, {}, function(){
      var session = ws.upgradeReq.session;
      username = session.username;
      if (username) {
        clients[username] = ws;
        console.log('client connected', username);
      }
  }); 

  ws.on('message', function incoming(message) {
    console.log('received:',message);
  });

  ws.on('close', function close(ws) {
  	delete clients[username];
  	console.log('client disconnected', username);
  });
});

app.on('notificationReceived', function(data) {
	console.log('notificationReceived', data);
  var ws = clients[data.username];
  if (ws)
    ws.send(JSON.stringify(data));
});

var port = process.env.PORT || '3000';
server.listen(port, function() {
  console.log('http/ws server listening on', port);
});