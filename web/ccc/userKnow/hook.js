'use strict';
module.exports = function (hook) {

    hook.get('/userKnow', ['data', 'locals', 'params', 'redirect'], function (data, locals, params, redirect) {
        locals.title = '新手引导_718bank理财平台 || 安全保障_718bank理财平台';
        locals.keywords = '理财指南、新手引导、新手必读、用户须知、新手帮助 || 投资风险、风险控制、风控、安全保障、投资安全、安全机制';
        locals.description = '718bank理财平台针对新注册用户给予更高的收益和奖券激励。|| 718bank理财平台与各大投资公司的战略合作以及多年的风险控制经验使得投资理财有了安全保障，拥有成熟完善的安全保障机制。'
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

