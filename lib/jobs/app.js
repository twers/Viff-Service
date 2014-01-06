
/**
 * Module dependencies.
 */

var express = require('express');
var jobCruder = require('../database')('jobs', require('./job-cruder'));
var Jobs = require('./jobs')(jobCruder);
var routes = require('./routes')(Jobs);
var path = require('path');
var app = module.exports = express();

var uploadDir = 'uploads';

app.use(express.multipart({
  limit: '1mb',
  uploadDir: path.join(process.cwd(), uploadDir)
}));

app.set('views', path.join(__dirname, 'views'));

app.post('/jobs', routes.jobs.createFormValidation, routes.jobs.create);

app.get('/jobs', routes.jobs.index);

app.get('/jobs/new', routes.jobs.new);

app.get('/jobs/:id', routes.jobs.show);