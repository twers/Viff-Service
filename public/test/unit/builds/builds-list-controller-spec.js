describe('BuildsListCtrl', function () {

  var scope,
      createController,
      idStub,
      fakeJob = { id: 'fakeJobId1' },
      builds = [{ status: 'success' }, { status: 'failure' }];

  beforeEach(module('viffservice/builds'));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    createController = function createController() {
      return $controller('BuildsListCtrl', {
        $scope: scope,
        $routeParams: { id: fakeJob.id }
      });
    };
  }));

  describe('contains build', function () {

    beforeEach(inject(function (Jobs) {
      idStub = sinon.stub(Jobs, 'id').callsArgWith(1, { builds: builds});
    }));

    afterEach(function () {
      idStub.restore();
    });

    it('should get builds by given Job id', function () {
      createController();
      idStub.firstCall.args[0].should.equal(fakeJob.id);
      scope.builds.should.equal(builds);
    });

    it('should contain build', function () {
      createController();
      scope.containsBuild.should.be.true;
    });

  });

  describe('doesn\'t contain build', function () {

    beforeEach(inject(function (Jobs) {
      idStub = sinon.stub(Jobs, 'id').callsArgWith(1, { builds: [] });
    }));

    afterEach(function () {
      idStub.restore();
    });

    it('should not contain build', function () {
      createController();
      scope.containsBuild.should.be.false;
    });

  });

});