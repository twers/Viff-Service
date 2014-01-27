require('blanket')({
  pattern: function (filename) {
    return filename.indexOf('Viff-Service/lib/') > -1;
  }
});