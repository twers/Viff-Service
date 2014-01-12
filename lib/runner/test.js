var runner = require('./runner');
var BuildRunner = require('./buildRunner');
var buildRunner = new BuildRunner(runner);

var JobsModule = require('../jobs');
var cruder = require('../jobs/job-cruder');
cruder = require('../database')('jobs', cruder);
var Jobs = JobsModule.Jobs(cruder);

Jobs.create({name: 'zhihao', config: './test.config.js'}, function (err, job) {
  buildRunner.runBuild(job, 0, function () {
  });
//  console.log(buildRunner);
});

