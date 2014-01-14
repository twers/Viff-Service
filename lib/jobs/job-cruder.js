module.exports = {
  create: function (job, opts, fn) {
    return this.save(job, opts, fn);
  },
  all: function (fn) {
    return this.find().toArray(fn);
  },
  findBuilds: function (jobId, fn) {
    this.find({_id: jobId}).toArray(function (err, data) {
      var transformedData = data[0].builds;
      fn(err, transformedData);
    });
  },
  addBuild: function (jobId, build, fn) {
    return this.update({_id: jobId}, { $push: {builds: build}}, fn);
  }
};
