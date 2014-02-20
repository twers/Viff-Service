module.exports = [
  '$timeout',
  'BuildEvent',
  'SockStream',
  'Builds',
  Watcher
];

function Watcher($timeout, BuildEvent, sockStream, Builds) {
  return function generator($scope, oncreate, ondestroy) {
    function init(jobId) {
      $scope.jobId = jobId || $scope.jobId;
      var latest;
      var len;
      if (!$scope.jobId) {
        return;
      }

      $scope.builds = Builds.get($scope.jobId);
      len = $scope.builds.length;
      if (!len) {
        return Builds.all({jid: $scope.jobId}, function(builds) {
          if (!builds.length) {
            return;
          }
          $timeout(init);
        });
      }
      BuildEvent.on('create', oncreate);
      latest = $scope.builds[len - 1];

      if (latest.isRunning) {
        oncreate(latest, $scope.jobId);
      }

      $scope.$on('$destroy', function() {
        BuildEvent.removeListener('create', oncreate);
        ondestroy();
      });
    }
    return init;
  };
}