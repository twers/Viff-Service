var JobsModule = require('../../../lib/jobs');
var cruder = require('../../../lib/jobs/job-cruder');
cruder = require('../../../lib/database')('jobs', cruder);


describe('job cruder', function() {
  var Jobs = JobsModule.Jobs(cruder);
  var Job = JobsModule.Job;
  
  it('should create a new job', function(done) {
    Jobs.create({name: 'zhihao'}, function(err, job) {
      if (err) {
        console.error(err);
      }
      job.should.be.instanceOf(Job);
      job.get('name').should.equal('zhihao');
      done();      
    });
  });
  it('should find all jobs', function(done) {
    Jobs.all(function(err,jobs) {
      if (err) {
        console.error(err);
      }
      jobs.forEach(function(job){
        job.should.be.instanceOf(Job);
      });
      done();
    });
  });
});
