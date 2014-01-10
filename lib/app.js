/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var expressValidator = require('express-validator');

// apps
var home = require('./home/app');
var jobs = require('./jobs/app');
var app = module.exports = express();

//db
app.use(function(req, res, next) {
  req.db = {};
  next();
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.bodyParser());
app.use(expressValidator());

app.configure('development', function() {
  app.use(express.errorHandler());
  app.use(express.static(path.join(__dirname, '..', 'public'))); 
  if (process.argv.indexOf('livereload') != -1) {
    debugger;
    console.log('livereload enabled');
    app.use(require('connect-livereload')({
      port: 35729
    }));
  }
});

app.configure('test', function () {
  app.use(express.static(path.join(__dirname, '..', 'public'))); 
});

app.configure('production', function() {
  app.use(express.static(path.join(__dirname, '..', 'public', 'dist')));
});

// apps
app.use(home);
app.use(jobs);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
