var isCalled = false;

var stubRunner = function () {
  isCalled = true;
};

var BuildRunner = require('../../../lib/runner/build-runner');
var buildRunner = new BuildRunner(stubRunner);
var JobsModule = require('../../../lib/jobs');
var cruder = require('../../../lib/jobs/job-cruder');
cruder = require('../../../lib/database')('jobs', cruder);
var Jobs = JobsModule.Jobs(cruder);

describe('Runner', function () {
  it('stubRunner is called', function () {
    Jobs.create({name: 'zhihao', config: '/vagrant/lib/runner/test.config.js'}, function (err, job) {
      buildRunner.runBuild(job, 0, function () {
        isCalled.should.be.true;
      });
    });
  });
});