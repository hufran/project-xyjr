'use strict';
module.exports = function (hook) {

    hook.get('/agreement/mobile/:param', ['data', 'locals', 'params', 'redirect'], function (data, locals, params, redirect) {
       
        var tabMap = {
            regist: '注册协议'
        };
        console.log(tabMap[params.param]);
        _.assign(locals, {
            tab: {
                name: params.tab,
                text: tabMap[params.tab]
            },
            article: data.articles('服务声明', tabMap[params.param]).then(function(r){
                return r.length > 0 ? r : null;
            })
        });
            return {
                view: 'mobile/'+params.param,
                parseTemplateVars: false
            };

        });
};
