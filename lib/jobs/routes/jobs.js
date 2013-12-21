// 1. name
// 2. file
exports.create = function(req, res) {
  var filePath = req.files.configFile.path;
  console.log(filePath);
  res.send(200);
};
