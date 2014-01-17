/**
 * Module dependencies.
 */

//var runner = require('./runner');
//var BuildRunner = require('./buildRunner');
//var buildRunner = new BuildRunner(runner);
//
//var JobsModule = require('../jobs');
//var cruder = require('../jobs/job-cruder');
//cruder = require('../database')('jobs', cruder);
//var Jobs = JobsModule.Jobs(cruder);


var express = require('express');
var routes = require('./routes');
var path = require('path');
var app = module.exports = express();

app.set('views', path.join(__dirname, 'views'));
app.post('/trigger', routes.trigger);
