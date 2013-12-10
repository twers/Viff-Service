angular
  .module('viffservice/home', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomePageCtrl',
        templateUrl: '/templates/home/index.html'
      })
      .otherwise({ redirectTo: '/' });
  })
  .controller('HomePageCtrl', function($scope) {
    
    $scope.benefits = [
      'happy',
      'allo',
      'viva la vida'
    ];

  })
