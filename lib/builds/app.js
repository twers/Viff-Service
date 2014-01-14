
var express = require('express');
var routes = require('./routes');
var app = module.exports = express();

app.get('/jobs/:id/builds', routes.index);