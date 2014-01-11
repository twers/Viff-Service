
module.exports = function(Jobs, Job) {
  var routes = {};

  routes.jobs = require('./jobs')(Jobs, Job);

  return routes;
};

