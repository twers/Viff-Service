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
    var defer = q.defer();
    jobCollection.findById(jobId, {_id: 1, builds: 1}, function (err, job) {
      if (err) {
        fn && fn(err);
        defer.reject(err);
        return;
      }
      defer.resolve(job.builds || []);
      return fn && fn(err, job.builds || []);
    });
    return defer.promise;
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
    buildId =+ buildId;
    jobCollection.findById(jobId, {builds: { $elemMatch: { _id: buildId } }}, function (err, job) {
      if (err) {
        defer.reject(err);
        return fn && fn(err);
      }
      defer.resolve(job.builds && job.builds[0]);
      return fn && fn(err, job.builds && job.builds[0]);
    });
    return defer.promise;
  },

  findOneAndUpdate: function(jobId, buildId, updateObj, fn) {
    var self = this;
    var update = {};
    var buildQuery = 'builds.' + buildId;
    var defer = q.defer();
    var promise;
    update[buildQuery] = updateObj;
        
    jobCollection.update({_id: jobId}, { $set: update }, defer.makeNodeResolver());

    promise = defer
                .promise
                .then(function() {
                  return self.findById(jobId, buildId);
                });

    if (fn) {
      promise.then(function(result) { fn(null, result); })
             .catch(fn);
    }

    return promise;
  }

};
