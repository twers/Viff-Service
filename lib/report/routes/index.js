var path = require('path');
console.log(__dirname);
var cwd = require('../../../lib/runner').cwd;

exports.index = function(req, res){
  res.render('report', { title: 'Viff Report' });
};

exports.servefile = function(req, res){
  var jobId = req.params[0]
    , buildId = req.params[1]
    , file = req.params[2]
    , filepath = path.join(cwd(jobId, buildId), file);
  res.sendfile(filepath);
};
