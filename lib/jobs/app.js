
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var path = require('path');
var app = module.exports = express();


// refer to: http://qingbob.com/blog/%E6%8A%98%E8%85%BE%EF%BC%9A%E5%88%A9%E7%94%A8Node.js+express%E6%A1%86%E5%AE%9E%E7%8E%B0%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0
app.set('views', path.join(__dirname, 'views'));

app.get('/jobs', routes.index);
app.post('/jobs', routes.jobs.create);
