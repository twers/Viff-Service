angular
  .module('viffservice/builds')
  .controller('BuildsListCtrl', [
    '$scope',
    '$routeParams',
    'Jobs',
    function (scope, params, Jobs) {
      var id = params.id;
      Jobs.id(id, function (job) {
        scope.builds = job.builds;
        scope.containsBuild = !!scope.builds.length;
      });
    }
  ]);
