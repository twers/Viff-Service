var jobCollection = require('../database')('jobs');
var _ = require('lodash');


module.exports = {
  create: function(jobId, build, fn) {
    jobCollection.findAndModify({_id: jobId}, [],{ $push: { builds: build }}, { update: true, new: true },function(err, job) {
      if (err) {
        fn(err);
      }
      else {
        fn(null, _.last(job.builds));
      }
    });
  },

  all: function(jobId, fn) {
    jobCollection.findById(jobId, {_id: 1, builds: 1},function(err, job) {
      if (err) {
        return fn(err);
      }
      return fn(err, job.builds || []);
    });
  },

  latest: function(jobId, fn) {
    jobCollection.findById(jobId, {builds: { $slice: -1 }},function(err, job) {
      if (err) {
        return fn(err);
      }
      return fn(err, job.builds && job.builds[0]);
    });
  },

  findById: function(jobId, buildId, fn) {
    jobCollection.findById(jobId, {builds: { $slice: [buildId, 1] }},function(err, job) {
      if (err) {
        return fn(err);
      }
      return fn(err, job.builds && job.builds[0]);
    });
  }

};
