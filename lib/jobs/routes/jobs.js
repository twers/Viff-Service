// 1. name
// 2. file
exports.create = function(req, res) {
	var filePath = req.files.configFile.path;
	req.db.job.save({
		name:req.body.jobName,
		createdTime: new Date(),
		config:filePath
	},function (error, job) {
		if (error) {console.error(error);}
		console.info('Add job:%s with path=%s', job.name, job.config);
		//todo add logic for next
	});
  res.send(200);
};

