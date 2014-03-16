var Ev = require('events').EventEmitter;
var sinon = require('sinon');
var buildCruder = require('../../../lib/builds/build-cruder');
var Build = require('../../../lib/builds/build');
var builds = require('../../../lib/builds/builds');
var Job = require('../../../lib/jobs').Job;
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
        build.get('_id').should.equal(0);
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

  describe('#track', function() {
    var currBuild, currJob, ps;

    beforeEach(function() {
      sinon.stub(buildCruder, 'findOneAndUpdate');
      currBuild = new Build({ name: 'bleh', _id: 0 });
      currJob = new Job({ name: 'bleh', _id: 0 });
      ps = new Ev();
      builds.track(currJob, currBuild, ps);
    });

    afterEach(function() {
      buildCruder.findOneAndUpdate.restore();
    });

    it('should track the exit and error event of a running process', function() {
      ps.listeners('exit').should.have.lengthOf(1);
    });

    it('should set the status to build when exit event emitted', function() {
      sinon.stub(currBuild, 'set');
      ps.emit('exit', 0);
      currBuild.set.calledWith('status').should.be.true;
      currBuild.set.restore();
    });

    it('should save the current exit status to database when process exit', function() {
      ps.emit('exit', 0);
      buildCruder.findOneAndUpdate
                 .calledWith(0, 0, currBuild.toObject())
                 .should.be.true;
    });

    it('should set the build status with aborted when user interrupt the process', function() {
      sinon.stub(currBuild, 'set');
      ps.emit('exit', null, 'SIGINT');
      currBuild.set.calledWith('status', 'aborted').should.be.true;
    });

    // http://nodejs.org/api/process.html#process_signal_events
    // SIGTERM && SIGINT need to + 128
    it('should set the build status with aborted when user interrupt the process', function() {
      sinon.stub(currBuild, 'set');
      ps.emit('exit', 130, null);
      currBuild.set.calledWith('status', 'aborted').should.be.true;
    });

    it('should set the build status with success when ps exit with code 0', function() {
      sinon.stub(currBuild, 'set');
      ps.emit('exit', 0);
      currBuild.set.calledWith('status', 'success').should.be.true;
    });

    it('should set the build status with failure when ps when exit code is not 0', function() {
      sinon.stub(currBuild, 'set');
      ps.emit('exit', 1);
      currBuild.set.calledWith('status', 'failure').should.be.true;
    });

    it('should set the build status with failure when ps have error', function() {
      sinon.stub(currBuild, 'set');
      ps.emit('error');
      currBuild.set.calledWith('status', 'failure').should.be.true;
    });
  });



});
