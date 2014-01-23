describe('JobDetailCtrl', function () {

  var scope, jobsIdStub, fakeJob = { id: 'fakeJobId' };

  beforeEach(module('viffservice/jobs'));

  beforeEach(inject(function (Jobs) {
    jobsIdStub = sinon.stub(Jobs, 'id').returns(fakeJob);
  }));

  afterEach(function () {
    jobsIdStub.restore();
  });

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();

    $controller('JobDetailCtrl', {
      $scope: scope,
      $routeParams: { id: fakeJob.id }
    });
  }));

  it('should get job by param id', function () {
    jobsIdStub.firstCall.args[0].should.equal(fakeJob.id);
    scope.job.should.equal(fakeJob);
  });

});