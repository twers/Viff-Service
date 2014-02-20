'use strict';

var shoe = require('shoe');
var emitStream = require('emit-stream');
var JSONStream = require('JSONStream');
var ln = require('./streams/linenum');


exports.genLink = function(jid, bid) {
  return '/jobs/' + jid + '/builds/' + bid + '/stream';
};

exports.runStream = function(jid, bid, ps, fn) {
  jid = String(jid);
  bid = String(bid);
  if (ps) {
    ps.lnStdout = ln.lineNumlify(ps.stdout);
    ps.lnStdErr = ln.lineNumlify(ps.stderr);
  }

  var server = require('./app');
  var link = exports.genLink(jid, bid);
  var sock = shoe(function(stream) {
    ps.lnStdout.pipe(stream);
    ps.lnStdErr.pipe(stream);
    ps.lnStdout.pipe(process.stdout);
    ps.lnStdErr.pipe(process.stderr);
    stream.on('end', function() {
      fn && fn(null, 'done');
    });
  });

  sock.install(server, link);
  return link;
};

exports.jobsStream = function(server) {
  var Jobs = require('./jobs/app').Jobs;
  var url = '/jobs-socket';

  var sock = shoe(function(stream) {
    emitStream(Jobs)
      .pipe(JSONStream.stringify())
      .pipe(stream);
  });

  sock.install(server, url);
};

exports.buildStream = function(server) {
  var builds = require('./builds/builds');
  var url = '/builds-socket';

  var sock = shoe(function(stream) {
    emitStream(builds)
      .pipe(JSONStream.stringify())
      .pipe(stream);
  });

  sock.install(server, url);
};
