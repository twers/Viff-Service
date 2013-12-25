
module.exports = function(Jobs) {

  var routes = {};

  routes.list = function(req, res) {
    Jobs.all(function() {
      res.send(200);
    });
  };

  routes.create = function(req, res) {
    var filePath = req.files.configFile.path;
    Jobs.create({
      name:req.param('jobName'),
      createdTime: new Date(),
      config:filePath
    },function (error, job) {
      if (error) {
        return res.send(400);
      }
      return res.send(200, job);
    });
  };

  return routes;
};


