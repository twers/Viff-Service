var through = require('event-stream').through;

angular.module('viffservice/jobs')
  .controller('JobDetailCtrl', [
    '$scope',
    '$routeParams',
    'Jobs',
    'Builds',
    'SockStream',
    function (scope, params, Jobs, Builds, SockStream) {
      var id = params.id;

      Jobs.id(id, function (job) {
        scope.job = job;
      });

      scope.run = function () {
        var id = scope.job._id;
        scope.$emit('viff.build.begin.event');
        Builds.create({jid: id}, {}, function (build) {
          var stream = SockStream(build.link);
          stream.pipe(through(function (data) {
              scope.$emit("viff.console.event", data);
            })).on('end', function () {
              scope.$emit('viff.build.end.event');
            });
        });
      };
    }
  ]);
