var spawn = require('child_process').spawn;
var path = require('path');
var JobsModule = require('../jobs');
var cruder = require('../jobs/job-cruder');
cruder = require('../database')('jobs', cruder);
var Jobs = JobsModule.Jobs(cruder);
var mkdirp = require('mkdirp');

function runner(job, buildId, callback) {
  var jobId = job.get('_id');
  Jobs.id(jobId, function (err, job) {
    if (err) {
      console.error(err);
    }
    Jobs.findBuilds(jobId, function (err) {
      if (err) {
        console.error(err);
      }
      //get Job object and Build id
      run(job, buildId, callback);
    });
  });
}

function run(job, buildId, callback) {
  var config = job.get('config');
  var jobId = job.get('_id');
  var cwdPath = path.join(__dirname, '../../temp', String(jobId), String(buildId));
  mkdirp.sync(cwdPath, 0777);
  var viff = spawn('viff', [config], {
    cwd: cwdPath
  });
  viff.stdout.pipe(process.stdout);
  viff.stderr.pipe(process.stderr);
  viff.on('error', function (err) {
    console.error(err);
  })
    .on('exit', function (exitCode) {
      callback(exitCode, viff);
    });
}

module.exports = runner;