require('angular');
require('angular-route');

require('./services/jobs-resource');
require('./services/jobs');
require('./controllers/job-list');

var jobsApp = angular.module('viffservice/jobs',[
  'ngRoute',
  'viffservice/jobs/JobsResource',
  'viffservice/jobs/JobsFactory',
  'viffservice/jobs/JobListCtrl'
]);

jobsApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: '/templates/jobs/show.html'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);


