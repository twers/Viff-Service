module.exports = [
  '$rootScope',
  '$scope',
  '$routeParams',
  'Builds',
  function (rootScope, scope, params, Builds) {
    
    var id = params.id;
    scope.builds = Builds.get(id);
    rootScope.$on('viff.build.begin.event', function () {
      scope.isRunning = true;
    });

    rootScope.$on('viff.build.end.event', function () {
      scope.isRunning = false;
    });

    function getList() {
      Builds.all({ jid: id }, function () {
      });
    }

    scope.hasRunningHistory = function () {
      return scope.isRunning || !!(scope.builds && scope.builds.length);
    };

    getList();
  }
];
