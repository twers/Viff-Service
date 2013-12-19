#!/usr/bin/env node

var fs = require('fs');
var util = require('util');

var PATTERN = /^(\[.+\])?(.+): (.+)$/;
var AUTHOR_PTN = /^[a-zA-Z&]+$/;
var TYPES = {
  refactor: true,
  feature: true,
  doc: true,
  fix: true,
  style: true,
  test: true
};


var error = function() {
  console.error('INVALID COMMIT MSG: ' + util.format.apply(null, arguments));
};


var validateMessage = function(message) {
  var isValid = true;

  var match = PATTERN.exec(message);
  if (!match) {
    error('does not match "[<type>]<author>: <subject>"!');
    return false;
  }

  var type = (match[1] || '').replace(/[\[\]]/g, '')
  var author = match[2];

  if(!AUTHOR_PTN.exec(author)) {
    error('other symbol rather than & or space is given!');
    return false;
  }
  if (type && !TYPES.hasOwnProperty(type)) {
    error('"%s" is not a valid type!', type)
    return false;
  }

  return isValid;
};


var firstLineFromBuffer = function(buffer) {
  return buffer.toString().split('\n').shift();
};


// publish for testing
exports.validateMessage = validateMessage;

// hacky start if not run by jasmine :-D
if (process.argv.join('').indexOf('jasmine-node') === -1) {
  var commitMsgFile = process.argv[2];
  var incorrectLogFile = commitMsgFile.replace('COMMIT_EDITMSG', 'logs/incorrect-commit-msgs');

  fs.readFile(commitMsgFile, function(err, buffer) {
    var msg = firstLineFromBuffer(buffer);

    if (!validateMessage(msg)) {
      fs.appendFile(incorrectLogFile, msg + '\n', function() {
        process.exit(1);
      });
    } else {
      process.exit(0);
    }
  });
}
