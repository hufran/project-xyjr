'use strict';
module.exports = function (router) {
var pageSize = 10;
    function renderPage(req,res,next,category,titleName,urlName){
        var riskMap=[];
        req.uest("/api/v2/cms/channels").end().then(function(r){

            if(r.body.length >= 1){

                var length=r.body.length,i;
                //定义数组顺序
                
                for(i=length-1;i>=0;i--){
                    if(r.body[i].category===category){
                        riskMap.push({id:r.body[i].id,name:r.body[i].name,url:"/newmodel/"+urlName+"/"+r.body[i].id});
                    }
                }
                res.render('index',{riskMap:JSON.stringify(riskMap),category:category,titleName:titleName});return;
                var length=riskMap.length;
                if(length>0){
                    var name,currentIndex,indexValue;
                    for(indexValue=0;indexValue<length;indexValue++){
                        if(req.params.id==riskMap[indexValue].id){
                            name=riskMap[indexValue].name;
                            currentIndex=riskMap[indexValue];
                            break;
                        }
                    }
                    
                    if(name){
                       req.uest('/api/v2/cms/category/'+category+'/name/' + encodeURIComponent(name) + '?sort' + 'PUBDATE')
                        .end().then(function (r) {
                            formatNews(r);
                            var contents = r.body.length >
                                    0 ? r.body : null;
                            if (contents.length >= 1) {
                                var current = (req.query.page === undefined) ? 1 : req.query.page;
                                var len=contents.length,results=[];
                                for(var i=0;i<len;i++){
                                    if(contents[i].id==req.params.id){
                                        results.push(contents[i]);
                                    }
                                }

                                var startIndex=(current-1)*pageSize,endIndex=startIndex+(pageSize-1),resultArray;
                                if(results.length%10<=current){
                                    if(results.length<endIndex){
                                        endIndex=results.length;
                                    };
                                    resultArray=results.splice(startIndex,endIndex);
                                }else{
                                    resultArray=[];
                                }
                                
                                res.render('index', {
                                    totalPage: createList(
                                        Math
                                        .ceil(resultArray.length /
                                            pageSize)),
                                    current: parseInt(
                                        current,
                                        10),
                                    titleName:titleName,
                                    tabs: riskMap,
                                    currentTab: currentIndex["name"],
                                    tabIndex: indexValue,
                                    tab: {
                                        name: req.params
                                            .id,
                                        text: currentIndex["name"],
                                        type:1
                                    },
                                    contents: resultArray.length>0?resultArray:null,
                                    // isList: isList
                                });


                            }else{
                                
                                res.render('index', {
                                    titleName:titleName,
                                    tabs: riskMap,
                                    currentTab: currentIndex["name"],
                                    tabIndex: indexValue,
                                    tab: {
                                        name: req.params
                                            .id,
                                        text: currentIndex["name"],
                                        type:0
                                    },
                                    contents: contents,
                                    // isList: isList
                                });
                            }
                        }); 
                    }else{
                        return next();
                    }
                    
                }else{
                    return next();
                }

            }else{
                return next();
            }
        });
        
    };
    router.get('/riskEducation/:id', function (req, res, next) {
        //风险教育
        renderPage(req, res, next,"FXJY","风险教育","riskEducation");
    });
    router.get('/disclosure/:id', function (req, res, next) {
        //信息披露
        renderPage(req, res, next,"XXPL","信息披露","disclosure");
    });


    function formatNews(news) {
        news = news || [];
        for (var i = 0; i < news.length; i++) {
            news[i].pubDate = moment(news[i].pubDate)
                .format('YYYY-MM-DD');

        }
        return news;
    }


    function createList(len) {
        var arr = [];
        for (var i = 0; i < len; i++) {
            arr[i] = i;
        }
        return arr;
    }


};
