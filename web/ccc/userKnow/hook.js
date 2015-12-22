'use strict';
module.exports = function (hook) {

    hook.get('/userKnow', ['data', 'locals', 'params', 'redirect'], function (data, locals, params, redirect) {
        locals.title = '用户须知 | 新毅金融-基于位置的理财平台';
        _.assign(locals, {
            contents: data.articles('其他', '用户须知').then(function (r) {
              
                var str = "";
                for (var i = r.length - 1; i >= 0; i--) {
                    str += "<h1>" + r[i].content + "</h1>";
                }
                return str;
            })
        });
        console.log("====locals")
        console.log(locals)
        return {
            view: 'userKnow/index',
            parseTemplateVars: false,

        };

    });
};

