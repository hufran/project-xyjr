'use strict';
var path = require('path');
var assert = require('assert');
var config = require('config');
assert(config.dsAppRoot);

var port = parseInt(process.env.PORT, 10) || config.port || 4000;

require('ds-build')(require('gulp'));
