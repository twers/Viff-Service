
/**
 * Module dependencies.
 */

var express = require('express');
var jobCruder = require('../database')('jobs', require('./job-cruder'));
var Jobs = require('./jobs')(jobCruder);
var Job = require('./job');
var routes = require('./routes')(Jobs, Job);
var path = require('path');
var mkdirp = require('mkdirp');
var app = module.exports = express();

var uploadDir = path.join(process.cwd(), 'uploads');
app.Jobs = Jobs;
app.use(function ensureUploadDir(req, res, next) {
  mkdirp(uploadDir, function() {
    next();
  });
});

app.use(express.multipart({
  limit: '1mb',
  uploadDir: uploadDir
}));

app.use(express.bodyParser());
app.use(express.methodOverride());

app.set('views', path.join(__dirname, 'views'));

app.post('/jobs', routes.jobs.createFormValidation, routes.jobs.create);

app.get('/jobs', routes.jobs.index);

app.get('/jobs/new', routes.jobs.new);

app.get('/jobs/:id/edit', routes.jobs.edit);

app.get('/jobs/:id', routes.jobs.show);

app.put('/jobs/:id', routes.jobs.updateFormValidation, routes.jobs.update);
