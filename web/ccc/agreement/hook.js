'use strict';
module.exports = function (hook) {

    hook.get('/agreement/mobile/:param', ['data', 'locals', 'params', 'redirect'], function (data, locals, params, redirect) {
        var cateMap = {
            regist:'DECLARATION',
            protocol:'DECLARATION'
        };
        
        var tabMap = {
            regist: '奇乐融用户注册协议',
            protocol:'用户投资服务协议'
        };
    
        _.assign(locals, {
            tab: {
                name: params.tab,
                text: tabMap[params.tab]
            },
            contents: data.get('/api/v2/cms/category/DECLARATION/name/'+encodeURIComponent(tabMap[params.param])).then(function (r) {
                    console.log('sdffsdfsdf');
                   console.log(r);
                    var contents= r.length > 0 ? r : null;
                    return contents;
                })
            });
            return {
                view: 'mobile/'+params.param,
                parseTemplateVars: false
            };

        });
};

