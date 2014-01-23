var through = require('event-stream').through;

angular.module('viffservice/jobs')
  .controller('JobDetailCtrl', [
    '$scope',
    '$routeParams',
    'Jobs',
    'Builds', 
    'SockStream',
    function (scope, params, Jobs, Builds, SockStream) {
      var id = params._id;

      scope.job = Jobs.id(id, function(job) {
        scope.job = job;
      });

      scope.run = function() {
        var id = scope.job._id;
        Builds.create({jid: id}, {},function(build) {
          var stream = SockStream(build.link);
          stream.pipe(through(function(data) {
            scope.$emit("viff.console.event", data);
          }));
        });
      };

    }
  ]);
