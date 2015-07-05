'use strict';
GLOBAL.APP_ROOT = __dirname;
var config = require('config');
var port = parseInt(process.env.PORT, 10) || config.port || 4000;
require('@ds/build')(require('gulp'), {
    appRoot: APP_ROOT,
    port: port,
    commonjs: []
});

