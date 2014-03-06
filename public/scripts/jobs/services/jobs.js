
var shoe = require('shoe');
var emitStream = require('emit-stream');
var JSONStream = require('JSONStream');

module.exports = [
  '$resource',
  '$timeout',
  Jobs
];

/**
 * properties
 *   - list: [] 
 */
var jobs;
var timeout;

/**
 * transform response from server then return the transform result
 * @return {Array} all the jobs
 */
function refreshAll(data) {
  data = angular.fromJson(data);
  timeout(function() {
    jobs.list.splice(0, jobs.list.length);
    jobs.list.push.apply(jobs.list, data);
  });
  return data;
}

/**
 * get notification and maintain the singleton job list in this app
 * @param {Jobs} Jobs model 
 * @param {$log} $log logger from ng
 */
function Jobs($resource, $timeout) {
  var parser = JSONStream.parse([true]);
  var stream = parser.pipe(shoe('/jobs-socket')).pipe(parser);
  var ev = emitStream(stream);
  timeout = $timeout;
  jobs = $resource('/jobs/:id', null, {
    create: { method: 'POST' },
    show: { method: 'GET' },
    update: { method: 'PUT', params: { id: '@id' } },
    all: { method: 'GET', isArray: true, transformResponse: refreshAll },
    remove: { method: 'DELETE' }
  });

  jobs.removeById = function(id) {
    return this.remove({id: id});
  };

  jobs.findById = jobs.id = function(id, fn) {
    return this.show({id: id}, fn);
  };
  
  ev.on('create', oncreate);
  ev.on('update', onupdate);

  jobs.list = [];

  return jobs;
}

/**
 * check if job is already in the job list
 * @param  {Object}  job item
 * @return {Boolean}
 */
function has(job) {
  return jobs.list.filter(function(aJob) {
    return aJob._id === job._id;
  }).length > 0;
}

/**
 * when receive a job msg from server then add the job to cache
 * @param {Object} job item from server
 * @return
 */
function oncreate(job) {
  timeout(function() {
    if (has(job)) {
      return;
    }
    jobs.list.push(job);
  });
}

/**
 * called when server updated a job
 * @param {Object} job item from server
 * @return
 */
function onupdate(job) {
  timeout(function() {
    var jobIndex = 0;
    jobs.list.forEach(function(item, index){
      if (item._id == job._id) {
        jobIndex = index;
      }
    });
    jobs.list[jobIndex].status = job.status;
  });
}


