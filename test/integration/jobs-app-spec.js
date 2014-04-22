var request = require('request');
var fs = require('fs');
var mongoskin = require('mongoskin');
var sinon = require('sinon');

var environment = require('../../config/environment');
var db = mongoskin.db(environment().db.connection, {safe: true});
var revertEnvTool = require('../tools');
var JobsModel = require('../../lib/jobs/app').Jobs;
var database = require('../../lib/database/index');

require('../../lib/app');

describe('Jobs RESTFUL', function () {
  var existingFiles;

  before(function () {
    existingFiles = revertEnvTool.trackExistingFile();
  });
  after(function () {
    revertEnvTool.revertEnv(existingFiles);

  });
  function SendFormRequest(url, fn) {
    var ropts = {
      url: url,
      headers: {
        'Accept': 'application/json'
      }
    };
    var r = request.post(ropts, fn);
    return r.form();
  }

  it('should put attached file in %PROJECT_PATH/data from post /job', function (done) {
    var form = SendFormRequest('http://localhost:3000/jobs', callback);
    form.append('name', 'test job');
    form.append('configFile', fs.createReadStream(process.cwd() + '/test/assets/configFile.js'));

    function callback(err, response, body) {
      var job = JSON.parse(body);
      job.should.have.property('config');
      done();
    }
  });

  it('should insert the path of uploaded json file into db', function (done) {
    var form = SendFormRequest('http://localhost:3000/jobs', callback);
    form.append('name', 'db save job test');
    form.append('configFile', fs.createReadStream(process.cwd() + '/test/assets/configFile.js'));

    function callback(error, response) {
      if (!error && response.statusCode == 200) {
        db.collection('jobs').findOne({name: "db save job test"}, function (err, job) {
          if (err) {
            throw err;
          }
          job.name.should.eql('db save job test');
          job.config.should.contain('"test": true');
          done();
        });
      }
    }
  });

  it('should get all the jobs', function (done) {
    request.get('http://localhost:3000/jobs', callback);

    function callback(error, response, body) {
      var jobs = JSON.parse(body);
      jobs.should.be.instanceOf(Array);
      done();
    }
  });


  it('should get the job by id', function (done) {
    var form = SendFormRequest('http://localhost:3000/jobs', callback);
    form.append('name', 'job with id');
    form.append('configFile', fs.createReadStream(process.cwd() + '/test/assets/configFile.js'));
    function callback(req, res, body) {
      body = JSON.parse(body);
      var id = body._id;
      request.get('http://localhost:3000/jobs/' + body._id, function (error, response, body) {
        var job = JSON.parse(body);
        job.name.should.equal('job with id');
        job._id.should.equal(id);
        done();
      });
    }
  });

  it('should return 400 when have error', function(done) {
    sinon.stub(JobsModel, 'id').callsArgWith(1, new Error());
    var r = request.put('http://localhost:3000/jobs/bleh', function(req, res) {
      res.statusCode.should.equal(400);
      JobsModel.id.restore();
      done();
    });

    var form = r.form();
    form.append('name', 'job with id');
    form.append('configFile', fs.createReadStream(process.cwd() + '/test/assets/configFile.js'));
  });

});