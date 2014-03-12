module.exports = [
  '$scope',
  '$routeParams',
  'Jobs',
  'Builds',
  function (scope, params, Jobs, Builds) {
    var id = params.id;

    scope.builds = Builds.get(id);

    scope.deleteJob = function(jobId) {
      Jobs.remove({id: jobId});
    };

    Jobs.id(id, function (job) {
      scope.job = job;
    });

  }
];
