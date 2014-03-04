var ansi2html = require('ansi2html');
var through = require('event-stream').through;

var ConsoleCtrl = [
  '$scope',
  '$timeout',
  '$http',
  'GeneralWatcher',
  'SockStream',
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
    ret = {
      num: Number(linenum),
      content: String(line)
    };
  }

  return ret;
}


function consoleCtrl($scope, $timeout, $http, GeneralWatcher, SockStream) {
  var stream;
  $scope.startWith = -1;

  this.init = GeneralWatcher($scope, oncreate, ondestroy);

  function ondestroy() {
    stream && stream.destroy();
  }

  function oncreate(build, jobid) {
    if (jobid !== $scope.jobId) {
      return;
    }
    stream = SockStream(build.link);

    $scope.$broadcast('refresh');

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

  $scope.loadPrevious = function () {
    var latest = $scope.builds[$scope.builds.length - 1];
    $http({
      method: 'GET',
      url: '/jobs/' + $scope.jobId + '/builds/' + latest._id + '/logs/' + $scope.startWith
    })
      .success(function (data) {
        $scope.startWith = 0;
        $scope.$broadcast('prevdata', data);
      })
      .error(function () {
        console.error('bleh!');
      });

  };

  $scope.shouldLoad = function () {
    return $scope.startWith !== 0;
  };
}

function Console() {
  return {
    restrict: 'E',
    templateUrl: '/templates/builds/console.html',
    controller: ConsoleCtrl,
    scope: {
      jobId: '=',
      lastBuildId: '='
    },
    replace: true,
    link: function (scope, el, attr, ctrl) {

      scope.$watch('jobId', function () {
        ctrl.init(scope.jobId);
      });

      scope.$on('refresh', function () {
        el.find('ul').html('');
      });

      scope.$on('prevdata', function (evt, data) {
        data.split('\n').reverse().forEach(function (line) {
          el.find('ul').prepend(angular.element('<li>' + ansi2html(line) + '</li>'));
        });
      });

      scope.$on('data', function (evt, line) {
        el.find('ul').append('<li>' + ansi2html(line) + '</li>');
      });

    }
  };
}

module.exports = [
  Console
];
