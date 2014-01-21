var fs       = require('fs');
var path     = require('path');
var request  = require('request');

var rootPath = path.join(__dirname, '../../../');
var database = require(rootPath + 'lib/database');
var crud     = database('jobs', require(rootPath + 'lib/jobs/job-cruder'));
var jobs     = require(rootPath + 'lib/jobs/jobs')(crud);

describe('job detail page when no build history', function(){

  var url, filePath = 'uploads/24273-cg77d9.js';

  before(function(done){
    jobs.create({ name: 'job details with no build', config: filePath}, function (err, job) {
      url = 'http://localhost:3000/jobs/' + job.get('_id');
      done();
    });
  });


  it('should get 200 response', function(done){
    request.get(url, function (err, res) {
      res.statusCode.should.equal(200);
      done();
    });
  });

  it('should has the configContent property', function(done){
    request.get({url: url, json: true}, function (err, res, body) {
      body.should.have.property('configContent');
      done();
    });
  });

  it('should get the correct config content', function(done){
    var readContent = fs.readFileSync(rootPath + filePath, 'utf8');

    request.get({url: url, json: true}, function (err, res, body) {
      body.configContent.should.equal(readContent);
      done();
    });
  });

});
