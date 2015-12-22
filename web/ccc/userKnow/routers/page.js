'use strict';
module.exports = function (router) {

    router.get('/', function (req, res, next) /*data, locals, params, redirect)*/ {
        res.locals.title = '用户须知 | 新毅金融-基于位置的理财平台';
        _.assign(res.locals, {
            contents: req.data.articles('其他', '用户须知').then(function (r) {

                var str = "";
                for (var i = r.length - 1; i >= 0; i--) {
                    str += "<h1>" + r[i].content + "</h1>";
                }
                return str;
            })
        });
        console.log("====locals")
        console.log(req.locals)
        res.render()

    });
};
