'use strict';

var _ = require('lodash');

/*
* Build Object
*
* Fields
* - id
* - status
* - createdTime
* - configPath
*/
function Build(buildObj) {
  var self = this;
  var defaults = {
    status: 'null',
    createdTime: new Date()
  };

  self._doc = _.defaults({}, defaults);


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

Build.prototype.isComplete = function() {
  var completedOpts = ['failure', 'success', 'aborted'];
  return completedOpts.indexOf(this.get('status')) > 0;
};

(function alias(name, as) {
  Build.prototype[as] = Build.prototype[name];
  return alias;
})
('toObject', 'toJSON')
('each', 'forEach');

module.exports = Build;
