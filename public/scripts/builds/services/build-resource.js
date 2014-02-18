var shoe = require('shoe');
var emitStream = require('emit-stream');
var JSONStream = require('JSONStream');
var builds;

module.exports = [
  '$resource',
  Builds
];

/**
 * called when server added a build
 * @param  {Object} build
 * @param  {String} jobId
 */
function oncreate(build, jobId) {
  var list = get(jobId);
  list[build._id] = build;
}

/**
 * called when server updated a build
 * @param  {Object} build
 * @param  {String} jobId
 */
function onupdate(build, jobId) {
  var originalBuild = get(jobId, build._id);
  if (!originalBuild) {
    return oncreate(build, jobId);
  }

  angular.extend(originalBuild, build);
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

function Builds($resource) {
  var parser = JSONStream.parse([true]);
  var stream = parser.pipe(shoe('/builds-socket')).pipe(parser);
  var ev = emitStream(stream);

  builds = $resource('/jobs/:jid/builds/:_id', null, {
    create: { method: 'POST' },
    all: resourceOpts()
  });

  builds.list = {};

  ev.on('create', oncreate);
  ev.on('update', onupdate);

  return builds;
}

function refreshAll(jobId, newBuilds) {
  var len;
  builds.list[jobId] = builds.list[jobId] || [];
  len = builds.list[jobId].length;
  builds.list[jobId].splice(0, len);
  builds.list[jobId].push.apply(builds.list[jobId], newBuilds);
}

function resourceOpts() {
  var jobId;
  return {
    method: 'GET',
    isArray: true,
    transformRequest: function(data) {
      if (data) {
        jobId = data.jid;
      }
      return data;
    },
    transformResponse: function(data) {
      data = angular.fromJson(data);
      if (jobId) {
        refreshAll(jobId, data);
      }
      return data;
    }
  };
}

