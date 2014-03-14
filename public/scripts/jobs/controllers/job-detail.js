module.exports = [
  '$scope',
  '$routeParams',
  'Jobs',
  'Builds',
  '$location',
  function (scope, params, Jobs, Builds, $location) {
    var id = params.id;

    scope.builds = Builds.get(id);

    scope.deleteJob = function (jobId) {
      Jobs.delete({id: jobId}, function () {
        $location.path('/');
      });
    };

    Jobs.id(id, function (job) {
      scope.job = job;
    });

  }
];
