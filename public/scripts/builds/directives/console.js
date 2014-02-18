var ansi2html = require('ansi2html');
var through = require('event-stream').through;

var ConsoleCtrl = [
  '$scope',
  '$timeout',
  'BuildEvent',
  'SockStream',
  'Builds',
  consoleCtrl
];

function unLinenum(line) {
  var LINE_NUM_REGEXP = /^([\d]+)[\s]+([\s\S]+)/;
  var matches = line.match(LINE_NUM_REGEXP);
  var linenum;
  var ret;

  if (matches) {
    linenum = matches[1];
    line = matches[2];
    ret =  {
      num: Number(linenum),
      content: String(line)
    }; 
  }

  return ret;
}


function consoleCtrl($scope, $timeout, BuildEvent, sockStream, Builds) {
  var stream;
  $scope.startWith = -1;

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
      stream && stream.destroy();
    });
  }

  function oncreate(build, jobid) {
    if (jobid !== $scope.jobId) {
      return;
    }
    stream = sockStream(build.link);

    function write(line) {
      line = unLinenum(line);
      if (!line) {
        return;
      }
      else {
        $scope.$emit('data', line.content);
      }
    }

    stream.once('data', onFirstline);

    stream.pipe(through(write));
  }

  function onFirstline(line) {
    line = unLinenum(line);
    if (!line) {
      $scope.startWith = 0;
    }
    else {
      $scope.startWith = Number(line.num);
    }
  }

  this.init = init;
}

function Console() {
  return {
    restrict: 'E',
    template: '<ul class="console"></ul>',
    controller: ConsoleCtrl,
    scope: {
      jobId: '='
    },
    replace: true,
    link: function(scope, el, attr, ctrl) {

      scope.$watch('jobId', function() {
        ctrl.init(scope.jobId);
      });

      scope.$on('data', function(evt, line) {
        el.append('<li>' + ansi2html(line) + '</li>');
      });
      
    }
  };
}

module.exports = [
  Console
];
