function BuildRunner(runner) {
  this._runner = runner;
}

BuildRunner.prototype.runBuild = function (job, buildId, callback) {
  var builds = job.get('builds');
  if (!!builds[buildId]) {
    console.error('build doesn\'t exist');
  } else if (builds.length == 0) {
    buildId = 0;
  }
  this._runner(job, buildId, callback);
}

module.exports = BuildRunner;