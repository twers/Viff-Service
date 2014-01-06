
describe('Job List Controller Test', function () {
  
  // 1. 能不能取出 job list 数据
  // 2. 测试取出的数据正确与否
  // 3. test called Jobs Service

  var createController, scope, Jobs;


  beforeEach(module('viffservice/jobs'));
  beforeEach(module(function($provide) {
    Jobs = sinon.stub({all: function() {}});
    Jobs.all.returns([]);
    $provide.value('Jobs', Jobs);
  }));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    createController = function() {
      return $controller('JobListCtrl', {$scope:scope});
    };
  }));

  it('should have joblist property', function() {
    createController();
    scope.should.have.property('jobList');
  });

  it('should call Jobs#all when initialize', function() {
    createController();
    Jobs.all.called.should.be.true;
  });

});
