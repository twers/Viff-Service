var fs       = require('fs');
var path     = require('path');
var request  = require('request');
var sinon    = require('sinon');

var rootPath = path.join(__dirname, '../../../');
var database = require(rootPath + 'lib/database');
var crud     = database('jobs', require(rootPath + 'lib/jobs/job-cruder'));
var jobs     = require(rootPath + 'lib/jobs/jobs')(crud);

describe('job detail page when no build history', function(){

  var url, filePath = '/uploads/24273-cg77d9.js', fileContent = 'abcd', readFileStub;

  before(function(done){
    jobs.create({ name: 'job details with no build', config: filePath}, function (err, job) {
      url = 'http://localhost:3000/jobs/' + job.get('_id');
      done();
    });
  });

  describe('with config file', function() {

    beforeEach(function () {
      readFileStub = sinon.stub(fs, 'readFile').callsArgWith(2, null, fileContent);
    });

    afterEach(function () {
      readFileStub.restore();
    });

    it('should get 200 response', function(done){
      request.get(url, function (err, res) {
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('should has the configContent property', function(done){
      request.get({url: url, json: true}, function (err, res, job) {
        job.should.have.property('configContent');
        done();
      });
    });

    it('should read correct file path', function(done) {
      request.get({url: url, json: true}, function () {
        readFileStub.calledOnce.should.be.true;
        readFileStub.lastCall.args[0].should.equal(filePath);
        done();
      });
    });

    it('should get the correct config content', function(done){
      request.get({url: url, json: true}, function (err, res, job) {
        job.configContent.should.equal(fileContent);
        done();
      });
    });
  });

  describe('without config file', function() {

    beforeEach(function () {
      readFileStub = sinon.stub(fs, 'readFile').callsArgWith(2, {}, '');
    });

    afterEach(function () {
      readFileStub.restore();
    });

    it('should return "config data error" if config file cannot be read', function(done) {
      readFileStub = readFileStub.callsArgWith(2, {}, '');
      request.get({url: url, json: true}, function (err, res, job) {
        job.configContent.should.equal('config data error');
        done();
      });
    });

  });

});
