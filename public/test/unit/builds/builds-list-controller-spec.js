describe('BuildsListCtrl', function () {

  var scope,
      createController,
      findBuildsStub,
      fakeJob = { _id: 'fakeJobId1' },
      builds = [{ status: 'success' }, { status: 'failure' }];

  beforeEach(module('viffservice/builds'));

  beforeEach(inject(function (Jobs) {
    findBuildsStub = sinon.stub(Jobs, 'findBuilds').returns(builds);
  }));

  afterEach(function () {
    findBuildsStub.restore();
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

  it('should get builds by given Job id', function () {
    createController();
    findBuildsStub.firstCall.args[0].should.equal(fakeJob._id);
    scope.builds.should.equal(builds);
  });

});