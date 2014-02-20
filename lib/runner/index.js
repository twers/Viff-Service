var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var spawn = require('child_process').spawn;
var path = require('path');

var mkdirp = require('mkdirp');
var es = require('event-stream');
var SIGINT = 'SIGINT';   // interrupt - like ctrl + c - man 3 signal to read more

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

Runner.prototype.run = function(jobName, buildId, configString) {
  var ps = run(jobName, buildId);

  var cs = new ConfigStream(configString);

  if (ps) {
    cs.pipe(ps.stdin);
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

Runner.prototype.loadLog = function(jobName, buildId, end) {
  var dir = cwd(jobName, buildId);
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

module.exports = new Runner();
