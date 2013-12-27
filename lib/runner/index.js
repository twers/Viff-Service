var spawn = require('child_process').spawn;
var path = require('path');



function ViffRunner (configPath, outputPath) {
  var viff = spawn('viff', [
    configPath
  ], {
    cwd: outputPath || path.join(process.cwd(), 'viff-report')
  });

  viff.on('error', function(err) {
    console.log(err);
  });

  return viff;
}

module.exports = ViffRunner;




