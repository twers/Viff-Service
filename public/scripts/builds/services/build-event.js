var shoe = require('shoe');
var emitStream = require('emit-stream');
var JSONStream = require('JSONStream');

module.exports = [
  function() {
    var parser = JSONStream.parse([true]);
    var stream = parser.pipe(shoe('/builds-socket')).pipe(parser);
    var ev = emitStream(stream);
    return ev;
  }
];
