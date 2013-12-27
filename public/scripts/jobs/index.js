require('angular');
require('angular-route');


angular
  .module('viffservice/jobs', ['ngRoute'])
  .config([
    '$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          controller: 'JobsPageCtrl',
          templateUrl: '/templates/jobs/index.html'
        })
        .otherwise({ redirectTo: '/' });
    }
  ])
  .controller('JobsPageCtrl', [
    '$scope',
    function($scope) {
      $scope.benefits = [
        'happy',
        'allo',
        'viva la vida'
      ];
    }
  ]);
