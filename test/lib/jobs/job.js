var request = require('request');
var fs = require('fs');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/viffService?auto_reconnect', {safe: true});
var JobsModule = require('../../../lib/jobs');
var revertEnvTool = require('../../tools');

require('../../../lib/app');

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

  it('should put attached file in %PROJECT_PATH/uploads from post /job', function (done) {
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
          job.config.should.match(/\.js$/);
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
});


describe('Jobs MODEL', function () {
  var Job = JobsModule.Job;
  describe('Job', function () {
    it('should initialize from a Object', function () {
      var jobObj = {
        name: 'test'
      };
      var job = new Job(jobObj);
      job.get('name').should.equal(jobObj.name);
    });
  });

  describe('Jobs', function () {
    //mocked cruder
    var memCruder = {
      _store: []
    };

    var Jobs = JobsModule.Jobs(memCruder);

    beforeEach(function () {
      memCruder._store = [];
    });

    it('should create a new job', function (done) {
      memCruder.create = function (obj, fn) {
        var self = this;
        setTimeout(function () {
          obj._id = '001';
          self._store.push(obj);
          fn(null, obj);
        });
      };
      Jobs.create({name: 'test'}, function (err, job) {
        job.should.be.instanceOf(Job);
        job.get('_id').should.equal('001');
        done();
      });
    });

    it('should list all jobs', function(done) {
      memCruder._store = [{
        _id: '001',
        name: 'test1'
      }, {
        _id: '002',
        name: 'test2'
      }];
      memCruder.all = function(fn){
        setTimeout(function() {
          fn(null, this._store);
        }.bind(this));
      };

      Jobs.all(function (err, jobs) {
        jobs.forEach(function (job, idx) {
          job.should.be.instanceOf(Job);
          job.get('_id').should.equal(memCruder._store[idx]._id);
        });
        done();
      });
    });

    it('should find only one job for id', function (done) {
      memCruder._store = [
        {
          _id: '001',
          name: 'test1'
        },
        {
          _id: '002',
          name: 'test2'
        }
      ];

      memCruder.findById = function (id, fn) {
        setTimeout(function () {
          var store = memCruder._store,
            idx = 0,
            job;

          while (!!(job = store[idx++])) {
            if (job._id === id) {
              fn(null, job);
            }
          }
        });
      };

      Jobs.id('002', function (err, job) {
        job.get('_id').should.equal('002');
        job.get('name').should.equal('test2');
        done();
      });
    });
  });
});
