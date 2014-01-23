'use strict';

var shoe = require('shoe');

exports.runStream = function(jid, bid, ps, fn) {
  jid = String(jid);
  bid = String(bid);
  
  var server = require('./app');
  var link = '/jobs/' + jid + '/builds/' + bid + '/stream';
  var sock = shoe(function(stream) {
    ps.stdout.pipe(stream);
    ps.stderr.pipe(stream);
    ps.stdout.pipe(process.stdout);
    ps.stderr.pipe(process.stderr);
    stream.on('end', function() {
      fn && fn(null, 'done');
    });
  });

  sock.install(server, link);
  return link;
};
