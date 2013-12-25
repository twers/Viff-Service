var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('lodash');

// id
// fields
// description
// file
// name
function Job(jobObj) {
  EventEmitter.call(this);
  this._docs = {};
  this.isNew = true;

  // initialize properties
  if (jobObj instanceof Job) {
    this.each(function(val, key) {
      this.set(key, val);
    });
  }
  else {
    _.each(jobObj, function(val, key) {
      this.set(key, val);
    }, this);
  }
}

util.inherits(Job, EventEmitter);

Job.prototype.set = function(name, value) {
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

Job.prototype.validate = function() {
  return true; 
};

Job.prototype.toObject = function() {
  return _.extend({}, this._docs);
};

// support for JSON.stringfiy
Job.prototype.toJSON = function() {
  return this.toObject();
};

Job.prototype.get = function(name) {
  return this._docs[name];
};

Job.prototype.save = function(fn) {
  fn(new Error('not implement'));
};

Job.prototype.each = function(fn) {
  return _(this._docs).each(fn.bind(this)).value();
};

module.exports = Job;
