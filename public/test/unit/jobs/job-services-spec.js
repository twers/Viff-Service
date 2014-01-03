describe('JobsResource', function () {
  var httpBackend, cruder;

  beforeEach(module('viffservice/jobs'));

  beforeEach(inject(function($httpBackend, JobsResource) {
    httpBackend = $httpBackend;
    cruder = JobsResource;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('shold get the joblist by calling all', function() {
    httpBackend.when('GET', '/jobs').respond([{name: 'test'}]);
    var joblist = cruder.all();
    httpBackend.flush();
    joblist[0].name.should.equal('test');
  });

});

describe('Jobs Factory Testing', function () {
  
});
