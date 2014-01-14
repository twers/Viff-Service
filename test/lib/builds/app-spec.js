var request = require('request');
var _ = require('lodash');

var database = require('../../../lib/database');
var jobCruder = database('jobs', require('../../../lib/jobs/job-cruder'));
var Jobs = require('../../../lib/jobs/jobs')(jobCruder);

describe('builds app', function () {

  var job, uri;

  before(function (done) {
    Jobs.all(function (ex, jobs) {
      job = _.last(jobs);
      uri = 'http://localhost:3000/jobs/' + job.get('_id') + '/builds';
      done();
    });

  });

  it('should return status code 200', function (done) {
    request.get(uri, function (error, res) {
      res.statusCode.should.equal(200);
      done();
    });
  });

});