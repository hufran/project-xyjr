'use strict';
module.exports = function (router) {

    router.get('/', function (req, res, next) /*data, locals, params, redirect)*/ {
        res.locals.title = '新手引导_718金融平台';
        res.locals.keywords = '投资指南、新手引导、新手必读、用户须知、新手帮助';
        res.locals.description = '718金融平台针对新注册用户给予更高的收益和奖券激励。';
        // res.locals.latestOne = req.uest(encodeURI('/api/v2/cms/category/OTHER/name/用户须知'))
        // .end()
        // .get('body')
        // .then( function(data){
        //
        //       _.assign(res.locals,{contents:data});
        // });
        // req.data.articles('category/OTHER','name/用户须知').then(function(r){
        //   // res.expose(r,'contents');
        //   res.locals.contents=r;
        // });
        // res.expose(req.data.articles('category/OTHER','name/用户须知'),'contents');
        res.locals.contents=req.data.articles('category/OTHER','name/用户须知');
res.render()
    });

};
