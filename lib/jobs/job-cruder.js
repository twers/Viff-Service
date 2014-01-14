module.exports = {
  create: function (job, opts, fn) {
    return this.save(job, opts, fn);
  },
  all: function (fn) {
    return this.find().toArray(fn);
  },
  findBuilds: function (jobId, fn) {
    this.findById(jobId, function (err, data) {
      fn(err, data.builds);
    });
  },
  addBuild: function (jobId, build, fn) {
    return this.update({_id: jobId}, { $push: {builds: build}}, fn);
  }
};
