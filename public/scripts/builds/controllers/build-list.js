angular
  .module('viffservice/builds')
  .controller('BuildsListCtrl', [
    '$scope',
    '$routeParams',
    'Jobs',
    function (scope, params, Jobs) {
      var id = params._id;
      scope.job = Jobs.id(id);
    }
  ]);
