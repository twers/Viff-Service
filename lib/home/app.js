
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var path = require('path');
var app = module.exports = express();

app.set('views', path.join(__dirname, 'views'));
app.get('/', routes.index);
app.get('/jobs/new', routes.createJob);
