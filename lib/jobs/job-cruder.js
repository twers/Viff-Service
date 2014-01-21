var _ = require('lodash');
var Build = require('../builds/build');

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
    return this.update({_id: jobId}, { $push: {"builds": build}}, fn);
  },
  updateBuild: function (jobId, buildId, build, fn) {
    var self = this;
    self.find({_id: jobId}).toArray(function (err, data) {
      var oldBuild = new Build(data[0].builds[buildId]);
      var query = {};
      _.each(build, function (val, key) {
        oldBuild.set(key, val);
      });
      query['builds.' + buildId] = oldBuild.toObject();
      return self.update({_id: jobId}, {$set: query}, fn);
    });
  }
};