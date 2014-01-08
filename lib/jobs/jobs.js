var Job = require('./job');

function Jobs(cruder) {
  this._jobs = [];
  this._cruder = cruder;
}

function jobHandler(fn) {
  return function(err, jobObj) {
    var job;
    if (err) {
      return fn && fn(err);
    }
    job = new Job(jobObj);
    return fn && fn(null, job);
  };
}

function jobsHandler(fn) {
  return function(err, jobs) {
    if (err) {
      return fn(err);
    }
    jobs = jobs.map(function(job) {
      return new Job(job);
    });
    fn(err, jobs);
  };
}

function commonJobHandler(fn) {
  return function(err, jobs) {
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
  };
}

Jobs.prototype.create = function(jobObj, fn) {
  var job = new Job(jobObj);
  var cruder = this._cruder;
  cruder.create(job.toObject(), commonJobHandler(fn));
};

Jobs.prototype.remove = function(job, fn) {
  var cruder = this._cruder;
  return cruder.remove(job, commonJobHandler(fn));
};

Jobs.prototype.removeById = function(jobId, fn) {
  var cruder = this._cruder;
  return cruder.removeById(jobId, commonJobHandler(fn));
};

Jobs.prototype.id = function(id, fn) {
  var cruder = this._cruder;
  return cruder.findById(id, commonJobHandler(fn));
};

Jobs.prototype.update = function(newJobObj,fn) {
  var cruder = this._cruder;
  newJobObj = new Job(newJobObj);
  return cruder.update(newJobObj.toObject(), newJobObj.toObject(), commonJobHandler(fn));
};

Jobs.prototype.all = function(fn) {
  var cruder = this._cruder;
  return cruder.all(commonJobHandler(fn));
};


module.exports = function(cruder) {
  return new Jobs(cruder);
};
