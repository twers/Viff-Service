
module.exports = function(Jobs) {
  var routes = {};

  routes.jobs = require('./jobs')(Jobs);

  return routes;
};

