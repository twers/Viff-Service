var request = require('request');

exports.sendFormRequest = function(url, fn) {
  var ropts = {
    url: url,
    headers: {
      'Accept': 'application/json'
    }
  };
  var r = request.post(ropts, fn);
  return r.form();
};
