module.exports = function(Jobs) {

  var routes = {};

  // GET /jobs
  routes.index = function(req, res) {
    Jobs.all(function(error,jobs) {
      if (error) {
        return res.send(400);
      }
      jobs.map(function(job){
        return JSON.stringify(job);
      });
      res.send(200,jobs);
    });
  };

  // GET /jobs/new
  routes.new = function(req, res) {
    res.render('new-job', { title: 'Create A new Viff Job' });
  };

  // GET /jobs/:job
  routes.show = function(req, res) {
    Jobs.id(req.params.id, function(error,job) {
      if (error) {
        return res.send(400);
      }
      res.send(200,job);
    });
  };

  // POST /jobs
  routes.create = function(req, res) {
    var filePath = req.files.configFile.path;
    var job = {
      name:req.param('name'),
      createdTime: new Date(),
      config:filePath,
      description: req.param('description')
    };
    
    Jobs.create(job ,function (error, job) {
      if (error) {
        return res.send(400);
      }
      return res.send(200, JSON.stringify(job));
    });
  };

  // PUT /jobs/:job
  routes.update = function(req, res) {
    res.send(404);
  };

  // DELETE /jobs/:job
  routes.destory = function(req, res) {
    res.send(404);
  };

  return routes;
};


