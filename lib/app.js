/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

// apps
var home = require('./home/app');

var app = module.exports = express();

// all environments

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

app.configure('dev', function() {
  app.use(express.errorHandler());
  express.static(path.join(__dirname, '..', 'public'));
});

app.configure('prod', function() {
  express.static(path.join(__dirname, '..', 'public', 'dist'));
});

// apps
app.use(home);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
