
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Viff' });
};


exports.createJob = function(req, res) {
  res.render('create-job', { title: 'Viff' });
};
