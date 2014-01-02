angular
  .module('viffservice/jobs/JobListCtrl', [])
  .controller('JobListCtrl', [
    '$scope',
    'Jobs',
    function ($scope, Jobs) {
      $scope.jobList = [];

      Jobs.all(function(err, jobs) {
        $scope.jobList = jobs;
      });

      $scope.joblistClick = function () {
        console.log('123');
      };
    }
  ]);
