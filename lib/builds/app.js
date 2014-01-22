/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var app = module.exports = express();

app.post('/run', routes.run);
app.get('/jobs/:id/builds', routes.index);
