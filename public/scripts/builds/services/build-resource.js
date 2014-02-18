var builds;
var timeout;


module.exports = [
  '$resource',
  '$timeout',
  'BuildEvent',
  Builds
];

/**
 * called when server added a build
 * @param  {Object} build
 * @param  {String} jobId
 */
function oncreate(build, jobId) {
  timeout(function() {
    var list = get(jobId);
    list[build._id] = build;  
  });
}

/**
 * called when server updated a build
 * @param  {Object} build
 * @param  {String} jobId
 */
function onupdate(build, jobId) {
  timeout(function() {
    var originalBuild = get(jobId, build._id);
    if (!originalBuild) {
      return oncreate(build, jobId);
    }
    angular.extend(originalBuild, build);
  });
}


/**
 * get the specific build list or build object for update
 * @param  {String} jobId   [the specific job id]
 * @param  {Number} buildId [the specific build id]
 * @return {Object|Array}   [build object or a build list(if have no buildId Provided)]
 */
function get(jobId, buildId) {
  var build;
  builds.list = builds.list || {};
  builds.list[jobId] = builds.list[jobId] || [];
  if (!buildId) {
    return builds.list[jobId];
  }

  build = builds.list[jobId][buildId];
  return build;
}

function Builds($resource, $timeout, ev) {
  var all;
  timeout = $timeout;
  builds = $resource('/jobs/:jid/builds/:_id', null, {
    create: { method: 'POST' },
    all: {
      method: 'GET',
      isArray: true
    }
  });

  builds.list = {};

  all = builds.all;

  builds.all = function(obj, fn) {
    var id = arguments[0].jid;
    all.call(builds, obj, function(data) {
      refreshAll(id, data);
      fn(data);
    });
  };

  ev.on('create', oncreate);
  ev.on('update', onupdate);
  builds.get = get;
  return builds;
}

function refreshAll(jobId, newBuilds) {
  var len;
  timeout(function() {
    var list = get(jobId);
    len = builds.list[jobId].length;
    list.splice(0, len);
    list.push.apply(list, newBuilds);  
  });
}


