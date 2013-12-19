
exports.jobs = require('./jobs');

exports.index = function(req, res) {
  res.render('index', {title: 'test upload file'});
};
