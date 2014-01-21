var run = require('../../runner');
module.exports = {
  // POST /run
  run: function (req, res) {
    var jobId = req.param("jobId");
    run(jobId, function() {
    });
    res.send(200);
  }
};