/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var app = module.exports = express();

app.get('/jobs/:id/builds', routes.index);
app.get('/jobs/:id/builds/:bid/logs/:end', routes.log);
app.post('/jobs/:id/builds/:bid/terminate', routes.terminate);
app.post('/jobs/:id/builds', routes.create, routes.run);
