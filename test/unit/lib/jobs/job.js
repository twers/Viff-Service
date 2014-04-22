var request = require('request');
var fs = require('fs');
var mongoskin = require('mongoskin');
var sinon = require('sinon');

var environment = require('../../../../config/environment');
var db = mongoskin.db(environment().db.connection, {safe: true});
var JobsModule = require('../../../../lib/jobs/index');
var database = require('../../../../lib/database/index');

require('../../../../lib/app');

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

    var Jobs, memCruder = {};

    beforeEach(function () {
      memCruder._store = [];
      Jobs = JobsModule.Jobs(memCruder);
    });

    after(function() {
      Jobs = JobsModule.Jobs(database('jobs', require('../../../../lib/jobs/job-cruder')));
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
