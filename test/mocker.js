var path = require('path');
var vm = require('vm');
var fs = require('fs');


function Mocker() {
  this._mocks = {};
}


Mocker.prototype.use = function(name, mock) {
  this._mocks[name] = mock;
}

Mocker.prototype.require = function(filePath, globals) {
  var exports = {};
  var context;
  var mocks = this._mocks;
  filePath = path.normalize(filePath);
  globals = globals || {};

  if (fs.lstatSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index');
  }

  if ('.js' !== path.extname(filePath)) {
    filePath += '.js';
  }


  context = {
    require: function(name) {
      if (mocks[name]) {
        return mocks[name];
      }
      if (name.charAt(0) !== '.') {
        return require(name);
      }

      return require(absPath);
    },
    __dirname: path.dirname(filePath),
    __filename: filePath,
    Buffer: Buffer,
    setTimeout: setTimeout,
    setInterval: setInterval,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval,
    process: process,
    console: console,
    exports: exports,
    module: {
      exports: exports
    }
  };

  Object.getOwnPropertyNames(globals || {}).forEach(function(name) {
    context[name] = globals[name];
  });

  vm.runInNewContext(fs.readFileSync(filePath), context, filePath);
  return context;
}

module.exports = Mocker;


