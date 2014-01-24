module.exports = function(Jobs, Job) {

  var routes = {};

  // GET /jobs
  routes.index = function(req, res) {
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

  // GET /jobs/new
  routes.new = function(req, res) {
    res.render('new-job', { title: 'Create A new Viff Job' });
  };

  // GET /jobs/:id/edit
  routes.edit = function(req, res) {
    Jobs.id(req.param('id'), function(error, job) {
      if (error) {
        return res.send(400);
      }
      res.render('edit-job', { title: 'Edit job', job: job.toJSON()});
    });
  };

  // GET /jobs/:id
  routes.show = function(req, res) {
    Jobs.id(req.param('id'), function(error, job) {
      if (error) {
        return res.send(400);
      }
      res.send(200, job);
    });
  };

  // POST /jobs
  routes.create = function(req, res) {
    var filePath = req.files.configFile.path;
    var job = new Job({
      name:req.param('name'),
      config:filePath,
      description: req.param('description')
    });
    Jobs.create(job.toObject() ,function (error, job) {
      if (error) {
        return res.send(400);
      }
      return res.format({
        html: function() {
          res.redirect('/');
        },
        json: function() {
          res.send(200, job);
        }
      });
    });
  };

  // PUT /jobs/:id
  routes.update = function(req, res) {
    Jobs.id(req.param('id'), function(error, job) {
      if (error) {
        return res.send(400);
      }
      var newJob = job.toObject();
      newJob.name = req.param("name");
      newJob.description = req.param("description");

      if (req.files.configFile.size !== 0) {
        newJob.config = req.files.configFile.path;
      }

      Jobs.update(newJob, function (error, job) {
        if(error) {
          res.send(404);
        }
        return res.format({
          html: function() {
            res.redirect('/#/jobs/' + req.param("id"));
          },
          json: function() {
            res.send(200, job);
          }
        });
      });
    });
  };

  // DELETE /jobs/:id
  routes.destory = function(req, res) {
    res.send(404);
  };

  routes.createFormValidation = function(req, res, next) {
    // create form validations are here
    req.assert('name', '1 to 30 charachors required').notEmpty().len(1, 30);
    var fileError;
    if (!req.files.configFile) {
      fileError = { param: 'configFile', msg: 'null file', value: '' };
    } else if (!req.files.configFile.originalFilename.match(/\.js$/)){
      fileError = { param: 'configFile', msg: 'only accept .js file', value: 'uploadFile.configFile.originalFilename' };
    }
    if (fileError || (req.validationErrors() && req.validationErrors().length)) {
      return res.format({
        html: function() {
          res.render('new-job', {title: 'Create A new Viff Job', errors: (req.validationErrors() || []).push(fileError) });
        },
        json: function() {
          res.send(400, req.validationErrors());
        }
      });
    }
    return next();
  };

  routes.updateFormValidation = function(req, res, next) {
    // update form validations are here
    req.assert('name', '1 to 30 charachors required').notEmpty().len(1, 30);
    var fileError;
    if (req.files.configFile.size !== 0) {
      if (!req.files.configFile.originalFilename.match(/\.js$/)){
        fileError = { param: 'configFile', msg: 'only accept .js file', value: 'uploadFile.configFile.originalFilename' };
      }
    }
    if (fileError || (req.validationErrors() && req.validationErrors().length)) {
      console.log("error");
      return res.format({
        html: function() {
          res.redirect('back');
        },
        json: function() {
          res.send(400, req.validationErrors());
        }
      });
    }
    return next();
  };

  return routes;
};


