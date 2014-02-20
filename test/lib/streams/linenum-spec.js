var ln = require('../../../lib/streams/linenum');

describe('linenum', function() {

  it('should add the linenum for each line from a stream', function() {
    var linenum = ln();

    linenum.on('data', function(data) {
      data = String(data);
      data.should.match(/^\d+[\s\S]+/);
    });

    linenum.write('line one\n');
    linenum.write('line two\n');
  });

});