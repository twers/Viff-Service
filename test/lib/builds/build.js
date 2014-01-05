var JobsModule = require('../../../lib/jobs');
var cruder = require('../../../lib/jobs/job-cruder');
cruder = require('../../../lib/database')('jobs', cruder);
var Jobs = JobsModule.Jobs(cruder);


describe("job build", function () {
  var createdJob;
  before(function (done) {
    Jobs.create({name: "job without build", config: "/fake.js"}, function (err, job) {
      createdJob = job;
      done();
    });
  });

  it("should get tasks of one build", function (done) {
    createdJob.builds.all(function (err, data) {
      //should.not.exist(data);
      console.log(data);
      done();
    });
  });

  it("should add task to build", function (done) {
    createdJob.builds.add({test: "fake"}, function () {
      createdJob.builds.all(function (err, data) {
        data.length.should.be.eql(1);
        done();
      });
    });
  });

  it("should add another task to build", function (done) {
    createdJob.builds.add({test: "lastfake"}, function () {
      createdJob.builds.all(function (err, data) {
        (data.length).should.be.eql(2);
        done();
      });
    });
  });
  it("should get the last build", function (done) {
    createdJob.builds.last(function (err, data) {
      data.should.be.eql({test: "lastfake"});
      done();
    });
  });
});