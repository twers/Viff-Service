var es = require('event-stream');

function lineNum() {

  var line = 0;

  function write(data) {
    var stream = this;
    stream.queue((line++) + ' ' + String(data) + '\n');
  }

  return es.through(write);
}

function lineNumlify(rs) {
  return rs.pipe(es.split('\n')).pipe(lineNum());
}

lineNum.lineNumlify = lineNumlify;

module.exports = lineNum;

