module.exports = [
  '$scope',
  '$routeParams',
  'Builds',
  function (scope, params, Builds) {
    var id = params._id;
    Builds.all({ jid: id }, function (builds) {
      scope.builds = builds;
      scope.containsBuild = !!scope.builds.length;
    });
  }
];
