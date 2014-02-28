'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var q = require('q');
var _ = require('lodash');
var Jobs = require('../jobs/app').Jobs;
var cruder = require('./build-cruder');
var Build = require('./build');
var ObjectId = require('bson').ObjectId;
var genLink = require('../sock-stream').genLink;

var signals = {
  'SIGINT': 'aborted'
};
var STATUS_SUCCESS = 'success';
var STATUS_FAILURE = 'failure';

inherits(Builds, EventEmitter);

function Builds() {
  EventEmitter.call(this);
}

Builds.prototype.id = function(jobid, buildid, fn) {
  var promise = cruder.findById(jobid, buildid)
                      .then(function(build) {
                        return new Build(build);
                      });

  if (fn) {
    promise.then(function(res) { fn(null, res); }).catch(fn);
  }
  return promise;   
};

Builds.prototype.all = function(jobid, fn) {
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

Builds.prototype.isRunning = function (jobid) {
  jobid = _.isString(jobid) ? new ObjectId(jobid) : jobid;
  return cruder
    .latest(jobid)
    .then(function (build) {
      build = new Build(build);
      return !!build.get('isRunning');
    });
};

Builds.prototype.create = function (jobid, obj) {
  // get some infos from job then create
  var defer = q.defer();
  var self = this;
  Jobs.id(jobid, function (err, job) {
    var build;
    if (err) {
      return defer.reject(err);
    }

    obj = obj || {};
    obj = _.defaults(obj, {
      config: job.get('config'),
      _id: !!job.get('builds') ? job.get('builds').length : 0,
      isRunning: true
    });

    obj.link = genLink(jobid, obj._id);

    build = new Build(obj);

    cruder
      .create(job.get('_id'), build.toObject())
      .then(function (build) {
        self.emit('create', build, jobid);
        defer.resolve(new Build(build));
      })
      .catch(function (err) {
        defer.reject(err);
      });
  });
  return defer.promise;
};


function markStatus(self, job, build, status) {
  build.set('status', status);
  build.set('isRunning', false);
  job.set('status', status);
  console.log(job.get('status'));
  console.log("____________fskjksjf__________fsd");
  return cruder.findOneAndUpdate(job.get('_id'), build.get('_id'), build.toObject(), function(err, build) {
    if (err) {
      console.error(err);
      return;
    }
    self.emit('update', build, job.get('_id'));
  });
}

function markSuccess(self, job, build) {
  markStatus(self, job, build, STATUS_SUCCESS);
}

function markFail(self, job, build) {
  markStatus(self, job, build, STATUS_FAILURE);
}

Builds.prototype.track = function(job, build, ps) {
  var self = this;
  if (!ps) {
    return markFail(self, job, build);
  }
  function onexit(code, signal) {
    if (code === 0) {
      ps.emit(STATUS_SUCCESS);
      return markSuccess(self, job, build);
    }
    if (signal) {
      return markStatus(self, job, build, signals[signal]);
    }

    ps.emit(STATUS_FAILURE);
    markFail(self, job, build);
  }


  function onerror() {
    ps.emit(STATUS_FAILURE);
    markFail(self, job, build); 
  }

  ps.on('exit', onexit);
  ps.on('error', onerror);
};

module.exports = new Builds();
