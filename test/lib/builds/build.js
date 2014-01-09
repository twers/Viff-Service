var JobsModule = require('../../../lib/jobs');
var cruder = require('../../../lib/jobs/job-cruder');
cruder = require('../../../lib/database')('jobs', cruder);
var Jobs = JobsModule.Jobs(cruder);
var Build = require('../../../lib/builds/').build;

describe("Job build", function () {
  var createdJob;
  beforeEach(function (done) {
    Jobs.create({name: "job without build", config: "/fake.js"}, function (err, job) {
      createdJob = job;
      done();
    });
  });

  it("should get tasks of one build", function () {
    createdJob.get('builds').should.eql([]);
  });

  it("should add task to build", function (done) {
    var build = new Build({test: "fake"});
    Jobs.addBuild(createdJob.get('_id'), build, function () {
      Jobs.id(createdJob.get('_id'), function (err, data) {
        data.get('builds').length.should.be.eql(1);
        done();
      });
    });
  });

  it("should add two tasks to build", function (done) {
    var build = new Build({test: "fake"});
    var build2 = new Build({test: "fake2"});
    Jobs.addBuild(createdJob.get('_id'), build, function () {
      Jobs.addBuild(createdJob.get('_id'), build2, function () {
        Jobs.id(createdJob.get('_id'), function (err, data) {
          data.get('builds').length.should.be.eql(2);
          done();
        });
      });
    });
  });

  it("should get builds", function (done) {
    var build = new Build({test: "fake"});
    Jobs.addBuild(createdJob.get('_id'), build, function () {
      Jobs.findBuilds(createdJob.get('_id'), function (err, data) {
        data.length.should.be.eql(1);
        done();
      });
    });
  });
});