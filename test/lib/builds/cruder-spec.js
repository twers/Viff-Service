var q = require('q');
var sinon = require('sinon');
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
  var expectBuild = { test: 'test', _id: 0 };
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
      return createBuild(job._id, expectBuild);
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
      currBuild.should.eql(expectBuild);
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

  it('should catch errors', function(done) {
    var methods = ['all', 'latest'];
  
    (function testErr(i) {
      if (i === methods.length) {
        done();
        return;
      }
      var method = methods[i];
      var findById = sinon.stub(db('jobs'), 'findById').callsArgWith(2, new Error('test error'));
      buildCruder[method](currJob._id, function(err) {
        should(err).Error;
        findById.restore();
        testErr(++i);
      });
    })(0);
  });


  describe('#findById', function() {
    it('should query the build by id', function(done) {
      buildCruder.findById(currJob._id, currBuild._id, function(err, build) {
        build.should.eql(currBuild);
        done();
      });
    });
  });


  describe('#fineOneAndUpdate', function() {
    it('should find a correct one and update', function(done) {
      var updatedBuild;
      
      buildCruder.findOneAndUpdate(currJob._id, currBuild._id, { 'test': 'bleh?' })
                 .then(function(build) {
                    updatedBuild = build;
                    return buildCruder.findById(currJob._id, currBuild._id);
                  })
                 .then(function(build) {
                    build.should.eql(updatedBuild);
                    done();
                  })
                 .catch(function(e) {
                    console.error(e);
                  });
    });
  });
});
