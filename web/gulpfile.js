'use strict';
var config = require('config');
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');

require('@ds/build')(require('gulp'), {
    appRoot: __dirname,
    port: config.port,
    commonjs: [].concat(config.commonjs)
        .filter(Boolean)
});

/**
 * 生成合作伙伴 json
 */
gulp.task('gen-partners', function () {
    var partners = fs.readdirSync(__dirname + '/ccc/index/img/partners/')
        .filter(function (f) {
            var file = path.join(__dirname + '/ccc/index/img/partners/', f);
            return path.extname(file) === '.jpg';
        });

    fs.writeFileSync(__dirname +'/ccc/index/js/partners.json',
        JSON.stringify(partners, null, '  '));
    
    console.log("partners.json generated.");
});