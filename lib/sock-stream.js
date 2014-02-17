'use strict';

var shoe = require('shoe');

var ln = require('./streams/linenum');

exports.runStream = function(jid, bid, ps, fn) {
  jid = String(jid);
  bid = String(bid);
  if (ps) {
    ps.lnStdout = ln.lineNumlify(ps.stdout);
    ps.lnStdErr = ln.lineNumlify(ps.stderr);
  }

  var server = require('./app');
  var link = '/jobs/' + jid + '/builds/' + bid + '/stream';
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
