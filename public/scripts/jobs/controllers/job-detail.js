angular.module('viffservice/jobs')
  .controller('JobDetailCtrl', [
    '$scope',
    '$routeParams',
    'Jobs', 
    function (scope, params, Jobs) {
      var id = params._id;
      scope.job = Jobs.id(id);
    }
  ]);