module.exports = [
  '$rootScope',
  '$scope',
  '$routeParams',
  'Builds',
  function (rootScope, scope, params, Builds) {
    var id = params.id;
    rootScope.$on('viff.build.begin.event', function () {
      scope.isRunning = true;
    });

    rootScope.$on('viff.build.end.event', function () {
      scope.isRunning = false;
      getList();
    });

    function getList() {
      Builds.all({ jid: id }, function (builds) {
        scope.builds = builds;
      });
    }

    scope.hasRunningHistory = function () {
      return scope.isRunning || !!(scope.builds && scope.builds.length);
    };

    getList();
  }
];
