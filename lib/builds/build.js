var _ = require('lodash');

function Build(buildObj) {
  var self = this;
  self._doc = {};

  // initialize properties
  if (buildObj instanceof Build) {
    buildObj.each(function (val, key) {
      self.set(key, val);
    });
  }

  else {
    _.each(buildObj, function (val, key) {
      self.set(key, val);
    });
  }
}

Build.prototype.toObject = function () {
  return _.extend({}, this._doc);
};

Build.prototype.each = function (fn) {
  return _.each(this.toObject(), fn, this);
};

Build.prototype.set = function (key, val) {
  this._doc[key] = val;
};

Build.prototype.get = function (key) {
  return this._doc[key];
};

module.exports = Build;
