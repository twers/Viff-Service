var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var spawn = require('child_process').spawn;
var path = require('path');

var mkdirp = require('mkdirp');
var es = require('event-stream');
var SIGINT = 'SIGINT';   // interrupt - like ctrl + c - man 3 signal to read more
var SPLITER = '/';

var Readable = require('stream').Readable;

inherits(Runner, EventEmitter);

function Runner() {
  EventEmitter.call(this);
  this._processes = {};
}

function cwd(jobId, buildId) {
  return path.join(process.cwd(), 'data', String(jobId), String(buildId));
}

function run(jobId, buildId) {
  var cwdPath = cwd(jobId, buildId);
  var viff;

  mkdirp.sync(cwdPath, 0777);
  viff = spawn('viffstream', [], {
    cwd: cwdPath
  });

  viff.stdout.pipe(fs.createWriteStream(path.join(cwdPath, 'out.log')));
  viff.stderr.pipe(fs.createWriteStream(path.join(cwdPath, 'err.log')));

  return viff;
}

function pid(jobId, buildId) {
  return String(jobId) + SPLITER + String(buildId);
}

Runner.prototype.get = function(jobId, buildId) {
  return this._processes[pid(jobId, buildId)];
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

Runner.prototype.run = function(jobId, buildId, configString) {
  var ps = run(jobId, buildId);

  var cs = new ConfigStream(configString);

  if (ps) {
    cs.pipe(ps.stdin);
    this._processes[pid(jobId, buildId)] = ps;
    ps.once('exit', destroy(this, pid(jobId, buildId)));
  }
  return ps;
};

Runner.prototype.terminate = function(jobId, buildId, fn) {
  var ps = this.get(jobId, buildId);
  var err;
  if (!ps) {
    err = new Error('runner - terminate: Have no such process running for ' + pid(jobId, buildId));
    if (!this.listeners('error').length && !fn) {
      throw err;
    }
    else if (!this.listeners('error').length && fn){
      fn && fn(err);
    }
    else {
      this.emit('error', err);
    }
    return false;
  }
  if (fn) {
    ps.once('exit', function() {
      fn(null);
    });
  }
  ps.kill(SIGINT);  // only sends the signal to child process
  return true;
};

function ConfigStream(configString) {
  Readable.call(this);
  this._sent = false;
  this._configString = configString;
}

inherits(ConfigStream, Readable);

ConfigStream.prototype._read = function() {
  if (!this._sent) {
    this.push(this._configString);
    this._sent = true;
  }
  else {
    this.push(null);
  }
};

Runner.prototype.loadLog = function(jobId, buildId, end) {
  var dir = cwd(jobId, buildId);
  var lc = 0;
  function write(line) {
    var stream = this;
    if (!end || end === -1) {
      stream.queue(String(line) + '\n');
    }
    else {
      lc === end ? stream.queue(null) : stream.queue(String(line) + '\n');
      lc++;
    }
  }

  var stream = fs.createReadStream(path.join(dir, 'out.log'))
                 .pipe(es.split('\n'))
                 .pipe(es.through(write));

  return stream;
};

/**
 * check if the process is running
 */
Runner.prototype.isRunning = function(jobId) {
  var pids = Object.keys(this._processes).map(function(pid) {
    return pid.split(SPLITER)[0];
  }).filter(function(id) {
    return id === jobId;
  });

  return pids.length > 0;
};
module.exports = new Runner();
