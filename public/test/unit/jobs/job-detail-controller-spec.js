describe('JobDetailCtrl', function () {
  
  var createController, scope, jobsIdStub, fakeJob = { _id: 'fakeJobId' };

  beforeEach(module('viffservice/jobs'));

  beforeEach(inject(function (Jobs) {
    jobsIdStub = sinon.stub(Jobs, 'id').returns(fakeJob);
  }));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();

    createController = function() {
      return $controller('JobDetailCtrl', { 
        $scope: scope,
        $routeParams: { _id: fakeJob._id }
      });
    };
  }));

  it('should get job by param id', function () {
    createController();
    jobsIdStub.firstCall.args[0].should.equal(fakeJob._id);
    scope.job.should.equal(fakeJob);
  });

});