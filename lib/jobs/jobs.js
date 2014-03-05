var Job = require('./job');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;


inherits(Jobs, EventEmitter);

function Jobs(cruder) {
  EventEmitter.call(this);
  this._jobs = [];
  this._cruder = cruder;
}

function jobHandler(fn) {
  return function (err, jobObj) {
    var job;
    if (err) {
      return fn && fn(err);
    }
    job = new Job(jobObj);
    return fn && fn(null, job);
  };
}

function jobsHandler(fn) {
  return function (err, jobs) {
    if (err) {
      return fn(err);
    }
    jobs = jobs.map(function (job) {
      return new Job(job);
    });
    fn(err, jobs);
  };
}

function commonJobHandler(fn, action) {
  return function (err, jobs) {
    if (err) {
      return fn && fn(err);
    }
    if (!jobs) {
      return fn && fn(new Error('job not found'));
    }
    // is cursor
    if (jobs.toArray) {
      return jobs.toArray(commonJobHandler(fn));
    }

    if (Array.isArray(jobs)) {
      jobsHandler(fn)(err, jobs);
    }
    else {
      jobHandler(fn)(err, jobs);
    }
    
    action && this.emit(action, jobs);
  };
}

Jobs.prototype.create = function (jobObj, fn) {
  var job = new Job(jobObj);
  var cruder = this._cruder;
  cruder.create(job.toObject(), commonJobHandler(fn, 'create').bind(this));
};

Jobs.prototype.remove = function (job, fn) {
  var cruder = this._cruder;
  return cruder.remove(job, commonJobHandler(fn, 'remove').bind(this));
};

Jobs.prototype.removeById = function (jobId, fn) {
  var cruder = this._cruder;
  return cruder.removeById(jobId, commonJobHandler(fn).bind(this));
};

Jobs.prototype.id = function (id, fn) {
  var cruder = this._cruder;
  return cruder.findById(id, commonJobHandler(fn).bind(this));
};

Jobs.prototype.update = function (newJobObj, fn) {
  var cruder = this._cruder;
  newJobObj = new Job(newJobObj);
  return cruder.findAndModify({_id: newJobObj.get('_id')}, [], newJobObj.toObject(), {new: true}, commonJobHandler(fn, 'update').bind(this));
};

Jobs.prototype.all = function (fn) {
  var cruder = this._cruder;
  return cruder.all(commonJobHandler(fn).bind(this));
};

var singleton;

module.exports = function (cruder) {
  if (!singleton) {
    singleton = new Jobs(cruder);
  } else {
    singleton._cruder = cruder;
  }
  return singleton;
};
