'use strict';

var jobModule = require('../../jobs');
var jobCruder = require('../../database')('jobs', require('../../jobs/job-cruder'));
var Builds = require('../builds');
var runner = require('../../runner');
var sockStream = require('../../sock-stream');
var Jobs = jobModule.Jobs(jobCruder);

module.exports = {
  index: function (req, res) {
    Builds.all(req.param('id'), function (ex, builds) {
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

  log: function(req, res) {
    var jobId = req.param('id');
    var buildId = req.param('bid');
    var end = req.param('end');

    Jobs.id(jobId, function(err, job) {
      if (err || !job) {
        return res.send(404);
      }
      var stream = runner.loadLog(jobId, buildId, end);
      stream.pipe(res);
    });
  },

  run: function (req, res) {
    var jobId = req.param('id');
    var jobName;
    Jobs.id(jobId, function (err, JobObj) {
      jobName = JobObj.get('name');
      var buildNumber = JobObj.get('builds').length - 1;
      var viff = runner.run(jobId, buildNumber, JobObj.get("config"));
      var socklink = sockStream.runStream(jobId, req.build.get('_id'), viff, function done() {
      });
      Builds.track(JobObj, req.build, viff);
      req.build.set('link', socklink);
      res.send(req.build);
    });
  },

  terminate: function(req, res) {
    var jobId = req.param('id');
    var buildId = req.param('bid');

    Jobs.id(jobId, function(err, job) {
      if (err || !job) {
        return res.send(404);
      }
      runner.terminate(jobId, buildId, function(err) {
        if (err) {
          return Builds.id(jobId, buildId, function(err, build) {
            Builds.track(job, build);
            return res.send(404);
          });
        }
        res.send(200);
      });
    });
  },
};
