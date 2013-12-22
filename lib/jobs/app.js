
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var path = require('path');
var app = module.exports = express();

//db
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/viffService?auto_reconnect', {safe:true});
app.use(function(req, res, next) {
  req.db.job = db.collection('job');
  next();
});

var uploadDir = 'uploads';

app.use(express.multipart({
  limit: '1mb',
  uploadDir: path.join(process.cwd(), uploadDir)
}));

app.set('views', path.join(__dirname, 'views'));

app.post('/jobs', routes.jobs.create);