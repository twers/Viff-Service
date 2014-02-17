'use strict';

var q = require('q');
var _ = require('lodash');
var Jobs = require('../jobs/app').Jobs;
var cruder = require('./build-cruder');
var Build = require('./build');
var ObjectId = require('bson').ObjectId;

var signals = {
  'SIGINT': 'aborted'
};
var STATUS_SUCCESS = 'success';
var STATUS_FAILURE = 'failure';

function Builds() {}

Builds.all = function(jobid, fn) {
  jobid = _.isString(jobid) ? new ObjectId(jobid) : jobid;
  var promise = cruder.all(jobid)
                      .then(function(result) {
                        return result.map(function(build) {
                          return new Build(build);
                        });
                      });

  if (fn) {
    promise
      .then(function(result) { fn(null, result); })
      .catch(fn);
  }
  
  return promise;
};

Builds.isRunning = function (jobid) {
  jobid = _.isString(jobid) ? new ObjectId(jobid) : jobid;
  return cruder
    .latest(jobid)
    .then(function (build) {
      build = new Build(build);
      return !!build.get('isRunning');
    });
};

Builds.create = function (jobid, obj) {
  // get some infos from job then create
  var defer = q.defer();
  Jobs.id(jobid, function (err, job) {
    var build;
    if (err) {
      return defer.reject(err);
    }

    obj = obj || {};
    obj = _.defaults(obj, {
      config: job.get('config'),
      _id: !!job.get('builds') ? job.get('builds').length : 0
    });

    build = new Build(obj);

    cruder
      .create(job.get('_id'), build.toObject())
      .then(function (build) {
        defer.resolve(new Build(build));
      })
      .catch(function (err) {
        defer.reject(err);
      });
  });
  return defer.promise;
};


function markStatus(job, build, status) {
  build.set('status', status);
  return cruder.findOneAndUpdate(job.get('_id'), build.get('_id'), build.toObject());
}

function markSuccess(job, build) {
  markStatus(job, build, STATUS_SUCCESS);
}

function markFail(job, build) {
  markStatus(job, build, STATUS_FAILURE);
}

Builds.track = function(job, build, ps) {
  function onexit(code, signal) {
    if (code === 0) {
      ps.emit(STATUS_SUCCESS);
      return markSuccess(job, build);
    }
    if (signal) {
      return markStatus(job, build, signals[signal]);
    }
    ps.emit(STATUS_FAILURE);
    markFail(job, build);
  }


  function onerror() {
    ps.emit(STATUS_FAILURE);
    markFail(job, build); 
  }

  ps.on('exit', onexit);
  ps.on('error', onerror);
};

module.exports = Builds;
