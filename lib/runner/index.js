var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var spawn = require('child_process').spawn;
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var Stream = require('stream');
var SIGINT = 'SIGINT';   // interrupt - like ctrl + c - man 3 signal to read more

inherits(Runner, EventEmitter);

function Runner() {
  this._processes = {};
}

function cwd(jobId, buildId) {
  return path.join(process.cwd(), 'data', String(jobId), String(buildId));
}

function run(jobId, buildId) {
  var cwdPath = cwd(jobId, buildId);
  var viff;
  
  mkdirp.sync(cwdPath, 0777);
  viff = spawn('viffstream', {
    cwd: cwdPath
  });
  
  viff.stdout.pipe(fs.createWriteStream(path.join(cwdPath, 'out.log')));
  viff.stderr.pipe(fs.createWriteStream(path.join(cwdPath, 'err.log')));

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

Runner.prototype.run = function(jobName, buildId, configStream) {
  var ps = run(jobName, buildId);
  var stream = new Stream();
  stream.on('data',function(data){ps.stdin.write(data);});
  stream.emit('data',configStream);

  if (ps) {
    this._processes[pid(jobName, buildId)] = ps;
    ps.once('exit', destroy(this, pid(jobName, buildId)));
  }
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
    ps.once('exit', function() { fn(null); });
  }
  ps.kill(SIGINT);  // only sends the signal to child process
  return true;
};


module.exports = new Runner();
