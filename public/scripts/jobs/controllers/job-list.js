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
