var jobCollection = require('../database')('jobs');

module.exports = {
  create: function(jobId, build, fn) {
    jobCollection.update({_id: jobId}, { $push: { builds: build }}, function(err, jobs) {
      if (err) {
        fn(err);
      }
      else {
        var job = jobs[0];
        fn(null, job.build)
      }
    });
  },

  all: function(jobId, fn) {
    jobCollection.findById(jobId, {_id: 1, builds: 1},function(err, job) {
      if (err) return fn(err);
      return fn(err, job.builds || []);
    });
  },

  latest: function(jobId, fn) {
    jobCollection.findById(jobId, {builds: { $slice: -1 }},function(err, job) {
      if (err) return fn(err);
      return fn(err, job.builds && job.builds[0]);
    });
  },

  findById: function(jobId, buildId, fn) {
    jobCollection.findById(jobId, {builds: { $slice: [buildId, 1] }},function(err, job) {
      if (err) return fn(err);
      return fn(err, job.builds && job.builds[0]);
    });
  }

};