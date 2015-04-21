'use strict';
var browserify = require('browserify');
var bpack = require('browserify/node_modules/browser-pack');
var watchify = require('watchify');
var glob = require('glob');
var fs = require('fs');
var path = require('path');
var values = require('lodash-node/modern/objects/values');
var assign = require('lodash-node/modern/objects/assign');
var transform = require('lodash-node/modern/objects/transform');
var through = require('through2');
var Promise = require('bluebird');
var config = require('config');

var cache = {};
var packageCache = {};
var args = {
    basedir: __dirname,
    cache: cache,
    packageCache: packageCache,
    fullPaths: true
};

var b = watchify(browserify(args));
var rpaths = glob.sync('node_modules/assets/js/main/**/*.js', {
    cwd: __dirname
})
    .concat(glob.sync('node_modules/ccc/*/js/main/**/*.js', {
        cwd: __dirname
    }));

b.require(rpaths.map(function (f) {
    return path.join(__dirname, f);
}));
b.on('update', console.log.bind(console, 'updated: '));
var cachedPaths = {};
var commonGlobalJs = [].concat(config.commonjs.global);
var commonGlobalJsDefer = Promise.defer();
b.bundle(function () {
    rpaths.forEach(function (p) {
        cachedPaths['/' + p] = 1;
    });
    console.log('cached js ready!');
    console.log('watched files: ');
    console.log(values(rpaths)
        .join('\n'));

    alterPipeline(newB())
        .require(commonGlobalJs)
        .bundle(function (err, src) {
            console.log(err);
            commonGlobalJsDefer.resolve(src);
        });
});

function isAbsolutePath(file) {
    var regexp = process.platform === 'win32' ?
        /^\w:/ :
        /^\//;
    return regexp.test(file);
}
var getPathRelativeToNodeModules = function (filePath) {
    return '/' + path.relative(args.basedir, filePath);
};

var bcp = fs.readFileSync(require.resolve(
    'browserify-common-prelude/dist/bcp.min.js'), 'utf-8');

function alterPipeline(b) {
    b.pipeline.get('pack')
        .splice(0, 1, through.obj(function (row, enc, next) {
            if (isAbsolutePath(row.id)) {
                row.id = getPathRelativeToNodeModules(row.file);
            }
            row.deps = transform(row.deps, function (result,
                value, key) {
                result[key] = getPathRelativeToNodeModules(
                    value);
            }, {});
            this.push(row);
            next();
        }), bpack(assign({}, args, {
            raw: true,
            hasExports: false,
            prelude: bcp
        })));
    return b;
}

function newB() {
    return browserify(assign({}, args, {
        debug: true
    }));
}

function bundleWithCache(fullPath, res) {
    res.type('js');
    alterPipeline(newB())
        .external(commonGlobalJs)
        .add(fullPath)
        .bundle(function (err, src) {
            console.log(err);
            res.send(src);
        });
}
var router = module.exports = require('express')
    .Router();
router.get('/node_modules/assets/js/common/global.js', function (req, res) {
    res.type('js');
    commonGlobalJsDefer.promise.then(res.send.bind(res));
});
router.use(function (req, res, next) {
    var fullPath = path.join(__dirname, req.path);
    if (!cachedPaths[req.path]) {
        return next();
    }
    fs.exists(fullPath, function (exists) {
        if (!exists) {
            return next();
        }
        bundleWithCache(fullPath, res);
    });


});