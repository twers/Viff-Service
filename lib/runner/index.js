var spawn = require('child_process').spawn;
var path = require('path');
var mkdirp = require('mkdirp');
var Build = require('../builds/build');

var JobsModule = require('../jobs');
var cruder = require('../jobs/job-cruder');
cruder = require('../database')('jobs', cruder);
var Jobs = JobsModule.Jobs(cruder);

function runner(jobId, callback) {
  Jobs.id(jobId, function (err, job) {
    if (!!err) {
      return callback(err, job);
    }
    return run(job, callback);
  });
}

function run(job, callback) {
  var config = job.get('config');
  var jobId = job.get('_id');
  var builds = job.get('builds');
  var buildIndex = builds.length;
  var cwdPath = path.join(process.cwd(), 'reports', String(jobId), String(buildIndex));


  mkdirp.sync(cwdPath, 0777);
  var viff = spawn('viff', [config], {
    cwd: cwdPath
  });

  viff.stdout.pipe(process.stdout);
  viff.stderr.pipe(process.stderr);

  recordBuildInDB(jobId, buildIndex, cwdPath, 'start');

  viff.on('exit', (function () {
    recordBuildInDB(jobId, buildIndex, cwdPath, 'success');
    callback && callback(null, viff);
  }));

  viff.on('error', (function (error) {
    recordBuildInDB(jobId, buildIndex, cwdPath, 'failure');
    callback && callback(error, viff);
  }));
  return viff;
}

function recordBuildInDB(jobId, buildIndex, cwdPath, status) {
  var build = new Build();
  if (status === 'start') {
    build.set('is_running', true);
    build.set('result', null);
    Jobs.addBuild(jobId, build, function () {
    });
  }
  else if (status == 'success') {
    build = new Build({is_running: false, result: "success", resultPath: cwdPath});
    Jobs.updateBuild(jobId, buildIndex, build, function () {
    });
  }
  else if (status == 'failure') {
    build = new Build({is_running: false, result: "failure", resultPath: cwdPath});
    Jobs.updateBuild(jobId, buildIndex, build, function () {
    });
  }
}

module.exports = runner;
