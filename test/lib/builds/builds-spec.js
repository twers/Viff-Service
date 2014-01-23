var builds = require('../../../lib/builds/builds');
var jobs = require('../../../lib/jobs/app').Jobs;
var jobCollection = require('../../../lib/database')('jobs');

describe('Builds', function() {

  var currjob;

  beforeEach(function(done) {
    jobs.create({ name: 'test', config: 'fake.js'}, function(err, job) {
      currjob = job;
      done();
    });
  });

  afterEach(function(done) {
    jobCollection.remove(currjob, done);
  });

  it('should create a new build with job\'s info', function(done) {
    builds
      .create(currjob.get('_id'))
      .then(function(build) {
        build.get('config').should.equal(currjob.get('config'));
        done();
      });
  });
  
  it('should reutrn false if the build is not running', function(done) {
    builds
      .isRunning(currjob.get('_id'))
      .then(function(running) {
        running.should.be.false;
        done();
      });
  });
});
