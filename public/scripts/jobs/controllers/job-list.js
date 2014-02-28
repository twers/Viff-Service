module.exports = [
  '$scope',
  'Jobs',
  function ($scope, Jobs) {
    
    Jobs.all(function() {
      $scope.selected = $scope.jobList[0];
    });

    $scope.jobList = Jobs.list;

    $scope.isActive = function(job) {
      return $scope.selected === job;
    };

    $scope.select = function(job) {
      $scope.selected = job;
    };
  }
];



// * already get the job.status correcttly
//   * when there is no build, then just show "no-test"
//   * otherwise:
//     * so how to update the job status as build status
//       * when build status changs
