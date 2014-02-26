module.exports = [RunButton];

var RunButtonCtrl = [
  '$scope',
  'GeneralWatcher',
  'Builds',
  function runButtonCtrl($scope, GeneralWatcher, Builds) {

    this.init = GeneralWatcher($scope, oncreate, ondestroy);

    function oncreate() {
      
    }

    function ondestroy() {

    }

    $scope.isRunning = function() {
      if (!$scope.builds) {
        return false;
      }
      if (!$scope.builds.length) {
        return false;
      }

      var latest = $scope.builds[$scope.builds.length - 1];
      return !!latest.isRunning;
    };


    $scope.onclick = function() {
      var id = $scope.jobId;
      var latest;
      if ($scope.isRunning()) {
        latest = $scope.builds[$scope.builds.length - 1];
        Builds.terminate({
          jid: id,
          id: latest._id
        }, {}, function() {});
      }
      else {
        Builds.create({
          jid: id
        }, {}, function () {});
      }
    };
  }
];

function RunButton() {
  return {
    restrict: 'E',
    templateUrl: '/templates/builds/run-button.html',
    replace: true,
    scope: {
      jobId: '='
    },
    controller: RunButtonCtrl,
    link: function(scope, el, attr, ctrl) {
      scope.$watch('jobId', ctrl.init);
    }
  };
}