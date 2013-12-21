
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var path = require('path');
var app = module.exports = express();

var uploadDir = 'uploads';

app.use(express.multipart({
  limit: '1mb',
  uploadDir: path.join(process.cwd(), uploadDir)
}));

app.set('views', path.join(__dirname, 'views'));

app.post('/jobs', routes.jobs.create);
