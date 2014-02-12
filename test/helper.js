var fs = require('fs');
var path = require('path');
var mongoskin = require('mongoskin');
var environment = require('../config/environment');
var db = mongoskin.db(environment().db.connection, {safe: true});
require('./coverage');

var existingFile;
var uploadsPath = path.join(__dirname, "../uploads");

// recode existing files in uploads/configFile.json
before(function (done) {
  fs.readdir(uploadsPath, function (err, fileList) {
    existingFile = fileList;
    done();
  });
});

// remove created test uploaded files and revert db changes
after(function (done) {
  //remove uploaded files
  fs.readdir(uploadsPath, function (err, fileList) {
    fileList.forEach(function (file) {
      if (existingFile.indexOf(file) == -1) {
        fs.unlink(uploadsPath + '/' + file, function (err) {
          if (err) {
            throw err;
          }
        });
      }
    });
    //remove db changes
    db.collection('jobs').remove(
      {$or: [
        {name: "test job"},
        {name: "db save job test"}
        // {name: "job with id"}
      ]},
      function (err) {
        if (err) {
          throw err;
        }
        done();
      });
  });
});