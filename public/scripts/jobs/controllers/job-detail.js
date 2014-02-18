module.exports = [
  '$scope',
  '$routeParams',
  'Jobs',
  'Builds',
  function (scope, params, Jobs, Builds) {
    var id = params.id;

    Jobs.id(id, function (job) {
      scope.job = job;
    });


    scope.run = function () {
      var id = scope.job._id;
      Builds.create({jid: id}, {}, function () {
      });
    };
  }
];
