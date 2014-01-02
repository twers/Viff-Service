module.exports = function(Jobs) {

  var routes = {};

  routes.list = function(req, res) {
    Jobs.all(function(error, jobs) {
      if (error) {
        return res.send(400);
      }
      jobs.map(function(job){
        return JSON.stringify(job);
      });
      res.send(200, jobs);
    });
  };

  routes.listByID = function(req, res) {
    Jobs.id(req.params.id, function(error,job) {
      if (error) {
        return res.send(400);
      }
      res.send(200, job);
    });
  };

  routes.create = function(req, res) {
    var filePath = req.files.configFile.path;
    var job = {
      name:req.param('jobName'),
      createdTime: new Date(),
      config:filePath
    };
    
    if (req.param('id')) {job._id = req.param('id');}
    Jobs.create(job ,function (error, job) {
      if (error) {
        return res.send(400);
      }
      return res.send(200, JSON.stringify(job));
    });
  };

  return routes;
};


