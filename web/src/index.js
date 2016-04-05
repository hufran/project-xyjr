'use strict';
var path = require('path');
process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config');
var config = require('config');
config.dsAppRoot = __dirname;

require('./ccc/index.js');
