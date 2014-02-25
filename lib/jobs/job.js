var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('lodash');

// id
// fields
// description
// file
// name
// builds
function Job(jobObj) {
  var self = this;
  var defaults = {
    status: 'no-test',
    createdTime: new Date(),
    builds: []
  };
  EventEmitter.call(self);
  self._docs = _.defaults({}, defaults);
  self.isNew = true;

  // initialize properties
  if (jobObj instanceof Job) {
    jobObj.each(function (val, key) {
      self.set(key, val);
    });
  }
  else {
    _.each(jobObj, function (val, key) {
      self.set(key, val);
    });
  }
}

util.inherits(Job, EventEmitter);

Job.prototype.set = function (name, value) {
  var oldVal;
  if (!this.validate(name, value)) {
    throw Error('not validate');
  }
  else {
    oldVal = this.get(name);
    this._docs[name] = value;
    this.emit('change', name, oldVal, value);
    this.emit('change.' + name, oldVal, value);
  }
};

Job.prototype.validate = function () {
  return true;
};

Job.prototype.toObject = function () {
  return _.extend({}, this._docs);
};

Job.prototype.get = function (name) {
  return this._docs[name];
};

Job.prototype.save = function (fn) {
  fn(new Error('not implement'));
};

Job.prototype.each = function (fn) {
  return _.each(this.toObject(), fn, this);
};

(function alias(name, as) {
  Job.prototype[as] = Job.prototype[name];
  return alias;
})
('toObject', 'toJSON')
('each', 'forEach');

module.exports = Job;
