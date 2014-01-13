module.exports = function () {
  var routes = {};
  routes.trigger = require('./build-runner');
  return routes;
};