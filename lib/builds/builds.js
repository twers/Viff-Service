'use strict';

var q = require('q');
var _ = require('lodash');
var Jobs = require('../jobs/app').Jobs;
var cruder = require('./build-cruder');
var Build = require('./build');
var ObjectId = require('bson').ObjectId;

function Builds() {
}

Builds.isRunning = function (jobid) {
  jobid = _.isString(jobid) ? new ObjectId(jobid) : jobid;
  return cruder
    .latest(jobid)
    .then(function (build) {
      build = new Build(build);
      return !!build.get('isRunning');
    });
};

Builds.create = function (jobid) {
  // get some infos from job then create
  var defer = q.defer();
  Jobs.id(jobid, function (err, job) {
    var build;
    if (err) {
      return defer.reject(err);
    }
    build = new Build({ config: job.get('config'), _id: !!job.get('builds') ? job.get('builds').length : 0 });
    cruder
      .create(job.get('_id'), build.toObject())
      .then(function (build) {
        defer.resolve(new Build(build));
      })
      .catch(function (err) {
        defer.reject(err);
      });
  });
  return defer.promise;
};


module.exports = Builds;
