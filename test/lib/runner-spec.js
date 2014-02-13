var sinon = require('sinon');
var Mocker = require('../mocker');
var path = require('path');
var Evt = require('events').EventEmitter;
var fs = require('fs');
var should = require('should');
var runnerContext;
var runner;


describe('#Runner', function() {
  var childProcess;
  var mkdirp;
  beforeEach(function() {
    var mocker = new Mocker();
    var ps = new Evt;
    ps.kill = sinon.spy();
    childProcess = {
      spawn: sinon.stub()
    };
    mkdirp = {
      sync: sinon.stub()
    };
    childProcess.spawn.returns(ps);
    mocker.use('child_process', childProcess);
    mocker.use('mkdirp', mkdirp);
    runnerContext = mocker.require('lib/runner');
    runner = runnerContext.module.exports;
  });

  describe('#context functionals', function() {

    describe('.cwd', function() {
      it('should join the path as [process.cwd]/[data]/[jobName]/[buildId]', function() {
        var jobName = 'test';
        var buildId = 0;
        var expect = path.join(process.cwd(), 'data', jobName, String(buildId));
        runnerContext.cwd(jobName, buildId).should.equal(expect);
      });
    });

    describe('.run', function() {
      var jobName = 'test';
      var buildId = 0;
      var config = {};
      beforeEach(function() {
        runnerContext.run(jobName, buildId, config);
      });

      it('should create a directory cwd() result', function() {
        var expectCwd = runnerContext.cwd(jobName, buildId);
        mkdirp.sync.called.should.be.true;
        mkdirp.sync.calledWith(expectCwd).should.be.true;
      });

      it('should run create child process viff', function() {
        var expectCwd = runnerContext.cwd(jobName, buildId);
        childProcess.spawn.called.should.be.true;
        childProcess.spawn.calledWith('viff', [config], { cwd: expectCwd }).should.be.true;
      });
    });

    describe('.pid', function() {
      it('should get the pid of a build [jobName]/[buildId]', function() {
        var jobName = 'test';
        var buildId = 0;
        runnerContext.pid(jobName, buildId).should.equal(jobName + '/' + buildId);
      });
    });
  });


  describe('#run', function() {
    var jobName = 'test';
    var buildId = 0;
    var ps;
    beforeEach(function() {
      ps = runner.run(jobName, buildId);
    });

    it('should register a exit event in ps', function() {
      ps.listeners('exit').should.have.lengthOf(1);
    });

    it('should cache the process in the runner', function() {
      runner._processes[runnerContext.pid(jobName, buildId)].should.equal(ps);
    });

    it('should not be in the cache when the process emit the exit event', function() {
      ps.emit('exit');
      var cached = runner._processes[runnerContext.pid(jobName, buildId)];
      should.equal(cached, undefined);
    });    
  });


  describe('#get', function() {
    var jobName = 'test';
    var buildId = 0;
    var ps;
    beforeEach(function() {
      ps = runner.run(jobName, buildId);
    });

    it('should get the process when the process is running', function() {
      var cached = runner.get(jobName, buildId);
      cached.should.equal(ps);
    });

    it('shouldn\'t get the process then process is not exists', function() {
      var cached = runner.get(jobName, 1);
      should.equal(cached, undefined);
    });

    it('shouldn\'t get the process when the process is exit', function() {
      ps.emit('exit');
      var cached = runner.get(jobName, 1);
      should.equal(cached, undefined);
    });
  });

  describe('#terminate', function() {
    var jobName = 'test';
    var buildId = 0;
    var ps;
    beforeEach(function() {
      ps = runner.run(jobName, buildId);
    });

    it('should throw err if pid is not exists', function() {
      (function() {
        runner.terminate('bleh?', 'bleh!');
      }).should.throw();
    });

    it('should emit error event when runner have error event listener', function() {
      var fn = sinon.spy();
      runner.on('error', fn);
      runner.terminate('bleh?', 'bleh!');
      fn.called.should.be.true;
    });

    it('should call error fn with err when pid is not exits', function() {
      var fn = sinon.spy();
      runner.on('error', function() {});
      runner.terminate('bleh?', 'bleh!', fn);
      should(fn.args[0][0]).Error;
    });

    it('should call ps#kill with signal SIGINT', function() {
      runner.terminate(jobName, buildId);
      ps.kill.called.should.be.true;
      ps.kill.calledWith('SIGINT').should.be.true;
    });

    it('should call the callback function when process exit', function() {
      var fn = sinon.spy();
      runner.terminate(jobName, buildId, fn);
      ps.emit('exit');
      fn.called.should.be.true;
    });
  });

});
