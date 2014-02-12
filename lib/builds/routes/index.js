'use strict';

var jobModule = require('../../jobs');
var jobCruder = require('../../database')('jobs', require('../../jobs/job-cruder'));
var Builds = require('../builds');
var runner = require('../../runner');
var sockStream = require('../../sock-stream');
var Jobs = jobModule.Jobs(jobCruder);

module.exports = {
  index: function (req, res) {
    Jobs.findBuilds(req.param('id'), function (ex, builds) {
      if (ex) {
        return res.send(500);
      }
      res.send(200, builds);
    });
  },

  create: function (req, res, next) {
    var jobId = req.param('id');
    Builds
      .create(jobId)
      .then(function (build) {
        req.build = build;
        next();
      })
      .catch(function (err) {
        res.send(404, err);
      });
  },

  run: function (req, res) {
    var jobId = req.param('id');
    var jobName;
    Jobs.id(jobId, function (err, JobObj) {
      jobName = JobObj.get('name');
      var buildNumber = JobObj.get('builds').length - 1;
      var viff = runner(jobName, buildNumber, req.build.get('config'));
      if (process.NODE_ENV !== 'test') {
        var socklink = sockStream.runStream(jobId, req.build.get('_id'), viff, function done() {
        });
        req.build.set('link', socklink);
      }
      res.send(req.build);
    });
  }
};
