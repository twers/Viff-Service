var q = require('q');
var Jobs = require('../jobs/app').Jobs;
var cruder = require('./build-cruder');
var Build = require('./build');

function Builds() {}

Builds.create = function(jobid) {
  // get some infos from job then create
  var defer = q.defer();
  Jobs.id(jobid, function(err, job) {
    var build = new Build({ configPath: job.get('configPath') });
    cruder
      .addBuild(jobid, build)
      .then(function(build) {
        defer.resolve(build);
      })
      .catch(function(err) {
        defer.reject(err);
      });
  });
  return defer.promise;
};


module.exports = Builds;