var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var spawn = require('child_process').spawn;
var path = require('path');
var mkdirp = require('mkdirp');

var SIGINT = 'SIGINT';   // interrupt - like ctrl + c - man 3 signal to read more

inherits(Runner, EventEmitter);

function Runner() {
  this._processes = {};
}

function cwd(jobName, buildId) {
  return path.join(process.cwd(), 'data', String(jobName), String(buildId));
}

function run(jobName, buildId, config) {
  var cwdPath = cwd(jobName, buildId);
  var viff;
  mkdirp.sync(cwdPath, 0777);
  if (process.env.NODE_ENV !== 'test') {
    viff = spawn('viff', [config], {
      cwd: cwdPath
    });
  }
  return viff;
}

function pid(jobName, buildId) {
  return String(jobName) + '/' + String(buildId);
}

Runner.prototype.get = function(jobName, buildId) {
  return this._processes[pid(jobName, buildId)];
};

function destroy(self, pid) {
  return function() {
    delete this._processes[pid];
    this._processes[pid] = undefined;
    return this;
  }.bind(self);
}

Runner.prototype.destroy = function(pid) {
  return destroy(this, pid)();
};

Runner.prototype.run = function(jobName, buildId, config) {
  var ps = run(jobName, buildId, config);
  this._processes[pid(jobName, buildId)] = ps;
  ps.once('exit', destroy(this, pid(jobName, buildId)));
  return ps;
};

Runner.prototype.terminate = function(jobName, buildId, fn) {
  var ps = this.get(jobName, buildId);
  var err;
  if (!ps) {
    err = new Error('runner - terminate: Have no such process running for ' + pid(jobName, buildId));
    if (!this.listeners('error').length && !fn) {
      throw err;
    }
    else {
      fn && fn(err);
      this.emit('error', err);
    }
    return false;
  }
  if (fn) {
    ps.once('exit', function(code, signal) { fn(null); });
  }
  ps.kill(SIGINT);  // only sends the signal to child process
  return true;
};


module.exports = new Runner();
