describe('BuildsListCtrl', function () {

  var scope, createController, jobsIdStub, fakeJob = { _id: 'fakeJobId1' };

  beforeEach(module('viffservice/builds'));

  beforeEach(inject(function (Jobs) {
    jobsIdStub = sinon.stub(Jobs, 'id').returns(fakeJob);
  }));

  afterEach(function () {
    jobsIdStub.restore();
  });

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    createController = function createController() {
      return $controller('BuildsListCtrl', {
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