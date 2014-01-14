var spawn = require('child_process').spawn;
var path = require('path');
var mkdirp = require('mkdirp');
var JobsModule = require('../jobs');
var cruder = require('../jobs/job-cruder');
var Jobs;

cruder = require('../database')('jobs', cruder);
Jobs = JobsModule.Jobs(cruder);

function runner(jobId, buildId, callback) {
  Jobs.id(jobId, function (err, job) {
    run(job, buildId, callback);
  });
}

function run(job, buildId, callback) {
  var config = job.get('config');
  var jobId = job.get('_id');
  var cwdPath = path.join(process.cwd(), 'reports', String(jobId), String(buildId));
  mkdirp.sync(cwdPath, 0777);
  var viff = spawn('viff', [config], {
    cwd: cwdPath
  });

  process.nextTick(function() {
    callback && callback(null, viff);
  });
}

module.exports = runner;
