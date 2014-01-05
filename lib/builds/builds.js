var cruder = require("./build-cruder");

function Builds(job) {
  this._job = job;
  this._cruder = require("../database")("jobs", cruder(this._job.get('_id')).bind());
}

Builds.prototype.all = function (fn) {
  this._cruder.builds(commonBuildHandler(fn));
};

Builds.prototype.add = function (build, fn) {
  this._cruder.addBuild(build, commonBuildHandler(fn));
};

Builds.prototype.last = function (build, fn) {
  this._cruder.getLastBuild(build, commonBuildHandler(fn));
};
//leave interface here:
function commonBuildHandler(fn) {
  return fn;
}

module.exports = function (job) {
  return new Builds(job);
};