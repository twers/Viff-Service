/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var app = module.exports = express();

app.post('/jobs/:id/builds', routes.create);
app.get('/jobs/:id/builds', routes.index);
