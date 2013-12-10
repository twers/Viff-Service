describe('viff service test: ', function(){
  
  beforeEach(module('ViffService'));
  
  it('should return a string', inject(function(viff){
     viff.should.equal('viff');
  }));
  
});