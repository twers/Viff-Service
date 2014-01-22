var _ = require('lodash');

/*
* Build Object
*
* Fields
* - id
* - status
* - createdTime
*/

function Build(buildObj) {
  var self = this;
  self._doc = {};

  // initialize properties
  if (buildObj instanceof Build) {
    buildObj = buildObj.toObject();
  }

  _.extend(self._doc, buildObj);
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

(function alias(name, as) {
  Build.prototype[as] = Build.prototype[name];
  return alias;
})
('toObject', 'toJSON')
('each', 'forEach');

module.exports = Build;
