var fs = require('fs');
var path = require('path');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/viffService?auto_reconnect', {safe: true});

var uploadsPath = path.join(__dirname, "../uploads");

var revertEnvTool = {
// recode existing files in uploads/configFile.json
    trackExistingFile: function () {
        return fs.readdirSync(uploadsPath);
    },

// remove created test uploaded files and revert db changes
    revertEnv: function (existingFile) {
        //remove uploaded files
        var fileList = fs.readdirSync(uploadsPath);
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
            });
    }
}

module.exports = revertEnvTool;