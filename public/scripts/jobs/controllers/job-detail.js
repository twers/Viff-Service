module.exports = [
  '$scope',
  '$routeParams',
  'Jobs',
  'Builds',
  function (scope, params, Jobs) {
    var id = params.id;

    Jobs.id(id, function (job) {
      scope.job = job;
    });
  }
];
