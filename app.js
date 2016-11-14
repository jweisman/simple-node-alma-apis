var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionParser=session({
  key: 'app.session', 
  secret: '1sJ3aK1pXJuO', 
  resave: false, 
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// Make cookies available in view
app.use(function(req,res,next){
    res.locals.cookies = req.cookies;
    res.locals.session = req.session;
    next();
});

app.use('/', require('./routes/index'));
app.use('/scan-in', require('./routes/scan-in'));
app.use('/webhooks', require('./routes/webhooks'));
app.use('/notifications', require('./routes/notifications'));
app.use('/login', require('./routes/login'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
