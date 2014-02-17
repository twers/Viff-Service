var request = require('request');
var _ = require('lodash');
var sinon = require('sinon');
var runner = require('../../../lib/runner');
var sockStream = require('../../../lib/sock-stream');
var database = require('../../../lib/database');
var Build = require('../../../lib/builds/').build;
var Builds = require('../../../lib/builds/builds');
var jobCruder = database('jobs', require('../../../lib/jobs/job-cruder'));
var Jobs = require('../../../lib/jobs/jobs')(jobCruder);

describe('builds app', function () {

  var uri, build, build2;
  before(function (done) {
    Jobs.create({ name: "job without build", config: "/fake.js"}, function (err, job) {
      build = new Build({ status: "success" });
      build2 = new Build({ status: "failure" });
      uri = 'http://localhost:3000/jobs/' + job.get('_id') + '/builds';

      Builds.create(job.get('_id'), build)
            .then(function() {
              return Builds.create(job.get('_id'), build2);
            })
            .then(function() { done(); });
    });
  });

  describe('GET /jobs/:id/builds', function() {
    it('should return status code 500 when causing error', function (done) {
      var findBuildsStub = sinon.stub(Builds, 'all').callsArgWith(1, Error('something wrong'), null);
      request.get(uri, function (error, res) {
        res.statusCode.should.equal(500);
        findBuildsStub.restore();
        done();
      });
    });

    it('should return status code 200', function (done) {
      request.get(uri, function (error, res) {
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('should return builds for the given job', function (done) {
      request.get(uri, function (error, res, body) {
        if (!error && res.statusCode === 200) {
          var builds = JSON.parse(body);
          _.first(builds).status.should.equal('success');
          _.last(builds).status.should.equal('failure');

          done();
        }
      });
    });
  });

  describe('POST /jobs/:id/builds', function() {

    beforeEach(function() {
      sinon.stub(runner, 'run');
      sinon.stub(sockStream, 'runStream');
    });

    afterEach(function() {
      runner.run.restore();
      sockStream.runStream.restore();
    });

    it('should return status code 404 when jobid is not exists', function(done) {
      request.post('http://localhost:3000/jobs/idnotexists/builds', function(err, res) {
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('should return status code 200 when jobid is exists', function(done) {
      request.post(uri, function(err, res) {
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('should get a new build object with job\'s config', function(done) {
      request.post(uri, function(err, res, body) {
        body = JSON.parse(body);
        body.should.have.property('config');
        body.config.should.equal('/fake.js');
        runner.run.called.should.be.true;
        sockStream.runStream.called.should.be.true;
        done();
      });
    });
  });


});
