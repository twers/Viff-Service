var spawn = require('child_process').spawn;
var path = require('path');
var JobsModule = require('../jobs');
var cruder = require('../jobs/job-cruder');
cruder = require('../database')('jobs', cruder);
var Jobs = JobsModule.Jobs(cruder);

function runner(job, buildId, callback) {
  var jobId = job.get('_id');
  Jobs.id(jobId, function (err, job) {
    Jobs.findBuilds(jobId, function (err, builds) {
      var build = builds[buildId];
      //get Job object and Build object
      run(job, build, callback);
    });
  });
}

function run(job, build, callback) {
  var config = job.get('config');
  console.log(config);
  var viff = spawn('viff', [config], {
    //todo : dout with this
    cwd: './'
  });

  viff.on('error', function (err) {
    console.log(err);
  });
  viff.on('exit', function (code) {
    //todo : write data into db.
    callback();
  });
}

module.exports = runner;