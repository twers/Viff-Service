angular
  .module('viffservice/jobs/JobListCtrl', [])
  .controller('JobListCtrl', [
    '$scope',
    'Jobs',
    function ($scope, Jobs) {
      $scope.jobList = Jobs.all(function(jobs) {
        $scope.selected = jobs[0];
      });

      $scope.isActive = function(job) {
        return $scope.selected === job;
      };

      $scope.select = function(job) {
        $scope.selected = job;
      };
    }
  ]);
