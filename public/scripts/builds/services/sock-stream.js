var shoe = require('shoe');
var through = require('event-stream').through;
var split = require('event-stream').split;


module.exports = [function() {
  return function(link) {
    var stream = shoe(link);
    stream
      .pipe(split())
      .pipe(through(function(data) {
        this.queue(String(data));
      }));

    return stream;
  };
}];