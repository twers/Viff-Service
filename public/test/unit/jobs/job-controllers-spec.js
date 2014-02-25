
describe('Job List Controller Test', function () {

  var createController, scope, Jobs;

  beforeEach(module('viffservice/jobs'));
  beforeEach(module(function($provide) {
    Jobs = sinon.stub({all: function() {}});
    Jobs.all.returns([]);
    Jobs.list = [];
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
