var shoe = require('shoe');
var through = require('event-stream').through;
var split = require('event-stream').split;


module.exports = [function() {
  return function(link) {
    var stream = shoe(link);
    stream = stream
      .pipe(split('\n'))
      .pipe(through(function(data) {
        this.queue(String(data));
        console.log(String(data));
      }));

    return stream;
  };
}];
