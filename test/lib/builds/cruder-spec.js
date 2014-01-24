var q = require('q');
var should = require('should');
var jobCruder = require('../../../lib/jobs/job-cruder');
var buildCruder = require('../../../lib/builds/build-cruder');
var db = require('../../../lib/database');

jobCruder = db('jobs', jobCruder);
buildCruder = db('builds', buildCruder);

describe('Builds Cruder', function() {

  function createJob(obj) {
    var create = q.nbind(jobCruder.create, jobCruder);
    return q.nfcall(create, obj);
  }

  function createBuild(jid, obj) {
    var create = q.nbind(buildCruder.create, buildCruder);
    return q.nfcall(create, jid, obj);
  }

  var currJob;
  var currBuild;

  beforeEach(function(done) {
    createJob({
      'name': 'test',
      'description': 'no desc',
      'configFile': 'test.js',
      'builds': []
    })
    .then(function(job) {
      currJob = job;
      return createBuild(job._id, { 'test': 'test' });
    })
    .then(function(build) {
      currBuild = build;
      done();
    });
  });

  afterEach(function(done) {
    jobCruder.remove(done);
  });

  describe('#create', function() {
    it('should have current build', function() {
      should.exists(currBuild);
    });

    it('should have the same build info as it created', function() {
      currBuild.should.eql({test: 'test'});
    });
  });

  describe('#all', function() {
    it('should find all builds in specific job id', function(done) {
      buildCruder.all(currJob._id, function(err, builds) {
        builds.should.have.lengthOf(1);
        builds[0].should.eql(currBuild);
        done();
      });
    });
  });

  describe('#latest', function() {
    it('should query the latest build', function(done) {
      buildCruder.latest(currJob._id, function(err, build) {
        build.should.eql(currBuild);
        done();
      });
    });
  });


  describe('#findById', function() {
    it('should query the build by id', function(done) {
      buildCruder.findById(currJob._id, 0, function(err, build) {
        build.should.eql(currBuild);
        done();
      });
    });
  });
});