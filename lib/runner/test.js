// this file will be removed. Just add it for pair to read how to use the build runner.

/*

var runner = require('./runner');
var BuildRunner = require('./build-runner');
var buildRunner = new BuildRunner(runner);
var JobsModule = require('../jobs');
var cruder = require('../jobs/job-cruder');
cruder = require('../database')('jobs', cruder);
var Jobs = JobsModule.Jobs(cruder);

Jobs.create({name: 'zhihao', config: '/vagrant/lib/runner/test.config.js'}, function (err, jobObj) {
  buildRunner.runBuild(jobObj, 0, function (err,viff) {
    //this callback will be run after the spawn process is exit.
    //the viff report file will be created at /temp/{job id}/{build id}/
  });
});

*/