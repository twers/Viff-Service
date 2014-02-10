require('blanket')({
  pattern: function (filename) {
    return filename.indexOf(process.cwd() + '/lib/') > -1;
  }
});