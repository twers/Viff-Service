var fs = require('fs');

module.exports = function (Jobs, Job) {

  var routes = {};

  // GET /jobs
  routes.index = function (req, res) {
    Jobs.all(function (error, jobs) {
      if (error) {
        return res.send(400);
      }

      jobs.map(function (job) {
        return JSON.stringify(job);
      });
      res.send(200, jobs);
    });
  };

  // GET /jobs/new
  routes.new = function (req, res) {
    res.render('new-job', { title: 'Create A new Viff Job' });
  };

  // GET /jobs/:id/edit
  routes.edit = function (req, res, validationErrors) {
    validationErrors = validationErrors || {};
    Jobs.id(req.param('id'), function (error, job) {
      if (error) {
        return res.send(400);
      }
      res.render('edit-job', { title: 'Edit job', job: job.toJSON(), validationErrors: validationErrors});
    });
  };

  // GET /jobs/:job
  routes.show = function (req, res) {
    Jobs.id(req.param('id'), function (error, job) {
      if (error) {
        return res.send(400);
      }

      job._docs.configContent = job.get("config");

      res.send(200, job);
    });
  };

  // POST /jobs
  routes.create = function (req, res) {
    var filePath = req.files.configFile.path;

    fs.readFile(filePath, 'utf-8', function (err, data) {
      if (err) {
        console.error(err);
      }

      var job = new Job({
        name: req.param('name'),
        config: data,
        description: req.param('description')
      });

      Jobs.create(job.toObject(), function (error, job) {
        if (error) {
          return res.send(400);
        }
        return res.format({
          html: function () {
            res.redirect('/');
          },
          json: function () {
            res.send(200, job);
          }
        });
      });
    });
  };

  // PUT /jobs/:id
  routes.update = function (req, res) {
    Jobs.id(req.param('id'), function (error, job) {
      if (error) {
        return res.send(400);
      }
      var newJob = job.toObject();
      newJob.name = req.param("name");
      newJob.description = req.param("description");

      if (req.files.configFile.size !== 0) {
        newJob.config = fs.readFileSync(req.files.configFile.path, 'utf-8');
      }

      Jobs.update(newJob, function (error) {
        if (error) {
          res.send(404);
        }
        return res.format({
          html: function () {
            res.redirect('/#/jobs/' + req.param("id"));
          },
          json: function () {
            res.send(200, newJob);
          }
        });
      });
    });
  };

  // DELETE /jobs/:job
  routes.destroy = function (req, res) {
    res.send(404);
  };

  function jobFormValidator(formParams) {
    var validationErrors = {};

    if (!formParams.name) {
      validationErrors.nameError = "Job name is required";
    }
    if (formParams.name.length > 30 || formParams.length < 1) {
      validationErrors.nameError = "1 to 30 charachors required";
    }

    if (!formParams.configFileName) {
      validationErrors.configFileError = "Must have a config file";
    } else if (!formParams.configFileName.match(/\.js$/)) {
      validationErrors.configFileError = "only accept .js file";
    }
    return validationErrors;
  }

  routes.createFormValidation = function (req, res, next) {
    var formParams = {};
    formParams.name = req.param('name').trim();
    formParams.configFileName = "";

    if (req.files.configFile) {
      formParams.configFileName = req.files.configFile.originalFilename;
    }

    var validationErrors = jobFormValidator(formParams);
    if (Object.keys(validationErrors).length > 0) {
      return res.format({
        html: function () {
          res.render('new-job', validationErrors);
        },
        json: function () {
          res.send(400, validationErrors);
        }
      });
    }
    return next();
  };

  routes.updateFormValidation = function (req, res, next) {
    // update form validations are here

    var formParams = {};
    formParams.name = req.param('name').trim();
    formParams.configFileName = "";

    if (req.files.configFile) {
      formParams.configFileName = req.files.configFile.originalFilename;
    }

    var validationErrors = jobFormValidator(formParams);

    if (validationErrors.configFileError == "Must have a config file") {
      validationErrors.configFileError = "";
    }

    if (validationErrors.nameError || validationErrors.configFileError) {
      return res.format({
        html: function () {
          routes.edit(req, res, validationErrors);
        },
        json: function () {
          res.send(400, validationErrors);
        }
      });
    }
    return next();
  };

  return routes;
};
