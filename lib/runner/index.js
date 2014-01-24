var spawn = require('child_process').spawn;
var path = require('path');
var mkdirp = require('mkdirp');


function run(jobId, buildId, config) {
  var cwdPath = path.join(process.cwd(), 'reports', String(jobId), String(buildId));
  var viff;
  mkdirp.sync(cwdPath, 0777);
  if (process.env.NODE_ENV !== 'test') {
    viff = spawn('viff', [config], {
      cwd: cwdPath
    });
  }
  return viff;
}

module.exports = run;
