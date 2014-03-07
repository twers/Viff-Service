var path = require('path');
console.log(__dirname);
var cwd = require('../../../lib/runner').cwd;

exports.index = function(req, res){
  res.render('report', { title: 'Viff Report' });
};

// exports.servejson = function(req, res){
//   var jobId = req.param('jid');
//   var buildId = req.param('bid');
//   var filepath = path.join(cwd(jobId, buildId), 'report.json');
//   res.sendfile(filepath);
// };

exports.servefile = function(req, res){
  console.log('regex');
  var jobId = req.params[0];
  var buildId = req.params[1];
  var file = req.params[2];
  console.log(req.params[2]);
  var filepath = path.join(cwd(jobId, buildId), file);
  res.sendfile(filepath);
};
