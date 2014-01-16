angular
  .module('viffservice/builds')
  .controller('BuildsListCtrl', [
    '$scope',
    '$routeParams',
    'Jobs',
    function (scope, params, Jobs) {
      var id = params._id;
      scope.builds = Jobs.findBuilds(id);
    }
  ]);
