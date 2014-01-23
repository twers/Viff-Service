var jobCollection = require('../database')('jobs');
var _ = require('lodash');
var q = require('q');

module.exports = {
  create: function (jobId, build, fn) {
    var defer = q.defer();
    jobCollection.findAndModify({_id: jobId}, [], { $push: { builds: build }}, { update: true, new: true }, function (err, job) {
      if (err) {
        defer.reject(err);
        return fn && fn(err);
      }
      defer.resolve(_.last(job.builds));
      fn && fn(null, _.last(job.builds));
    });
    return defer.promise;
  },

  all: function (jobId, fn) {
    jobCollection.findById(jobId, {_id: 1, builds: 1}, function (err, job) {
      if (err) {
        return fn(err);
      }
      return fn(err, job.builds || []);
    });
  },

  latest: function (jobId, fn) {
    var defer = q.defer();
    jobCollection.findById(jobId, {builds: { $slice: -1 }}, function (err, job) {
      if (err) {
        defer.reject(err);
        return fn && fn(err);
      }
      defer.resolve(job.builds && job.builds[0]);
      return fn && fn(err, job.builds && job.builds[0]);
    });
    return defer.promise;
  },

  findById: function (jobId, buildId, fn) {
    var defer = q.defer();
    jobCollection.findById(jobId, {builds: { $slice: [buildId, 1] }}, function (err, job) {
      if (err) {
        defer.reject(err);
        return fn && fn(err);
      }
      defer.resolve(job.builds && job.builds[0]);
      return fn(err, job.builds && job.builds[0]);
    });
    return defer.promise;
  }

};
