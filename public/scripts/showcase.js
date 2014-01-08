require('./ui/progressbar');

angular.module("viffservice/showcase", ["viffservice/ui/progressbar"])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/showcase', {
    controller: 'ShowcaseCtrl',
    controllerAs: 'showcase',
    templateUrl: '/templates/showcase/index.html'
  });
}])
.controller('ShowcaseCtrl', function() {
  console.log(1);

  this.percentage = 0.5;

});
