require('angular');
require('angular-route');


angular
  .module('viffservice/home', ['ngRoute'])
  .config([
    '$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          controller: 'HomePageCtrl',
          templateUrl: '/templates/home/index.html'
        })
        .otherwise({ redirectTo: '/' });
    }
  ])
  .controller('HomePageCtrl', [
    '$scope',
    function($scope) {
      $scope.benefits = [
        'happy',
        'allo',
        'viva la vida'
      ];
    }
  ]);
