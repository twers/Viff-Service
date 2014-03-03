module.exports = [
  '$rootScope',
  '$scope',
  '$routeParams',
  'Builds',
  function (rootScope, scope, params, Builds) {
    var id = params.id;
    scope.builds = Builds.get(id);

    scope.hasRunningHistory = function () {
      return !!(scope.builds && scope.builds.length);
    };
  }
];
