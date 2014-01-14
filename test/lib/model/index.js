var ModelBuilder = require('../../../lib/model');
var should = require('should');

describe('ModelBuilder', function() {

  it('should ModelBuilder exists', function() {
    should.exists(ModelBuilder);
  });

  it('should be a function', function() {
    ModelBuilder.should.be.instanceOf(Function);
  });

  describe('#create model', function() {
    it('should create a schema with custom methods', function() {
      var calSchema = new ModelBuilder.Schema();
      var Calculator, c;

      calSchema.methods.add = function(a, b) {
        return a + b;
      };

      Calculator = ModelBuilder(calSchema);
      c = new Calculator();
      c.add(1, 1).should.equal(2);
    });
  });

  

});