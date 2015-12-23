'use strict';
module.exports = function (router) {

    router.get('/', function (req, res, next) /*data, locals, params, redirect)*/ {
        res.locals.title = '用户须知 | 新毅金融-基于位置的理财平台';
        res.locals.latestOne = req.uest(encodeURI('/api/v2/cms/category/OTHER/name/用户须知'))
        .end()
        .get('body')
        .then( function(data){
           
              _.assign(res.locals,{contents:data});
        });
res.render()
    });
  
};
