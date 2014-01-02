
describe('Job List Controller Test', function () {
  
  // 1. 能不能取出 job list 数据
  // 2. 测试取出的数据正确与否

  var createController, scope, httpBackend;
  var expectData = [{
    name: 'test'
  }];
  beforeEach(module('viffservice/home'));

  beforeEach(inject(function($rootScope, $controller, $httpBackend) {
    httpBackend = $httpBackend;
    httpBackend.when('GET', '/jobs').respond(expectData);
    scope = $rootScope.$new();
    createController = function() {
      return $controller('HomeJobListCtrl', {$scope:scope});
    };
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should have joblist property', function() {
    createController();
    httpBackend.flush();
    scope.should.have.property('jobList');
  });

  it('should fetch the joblist', function() {
    createController();
    httpBackend.expectGET('/jobs');
    httpBackend.flush();
    scope.jobList[0].should.have.property('name');
    scope.jobList[0].name.should.equal(expectData[0].name);  
  });

});
