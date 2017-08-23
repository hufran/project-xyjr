'use strict';
module.exports = function (router) {
var pageSize = 10;
    function renderPage(category,titleName,urlName){
        var riskMap=[];
        req.uest("/api/v2/cms/channels").end().then(function(r){
            if(r.body.length >= 1){

                var length=r.body.length,i;
                //定义数组顺序
                for(i=length-1;i>=0;i--){
                    if(r.body[i].category===category){
                        riskMap.push({id:r.body[i].id,name:r.body[i].name,url:"/"+urlName+"/riskEducation/"+r.body[i].id});
                    }
                }
                res.render('index', {
                    titleName:titleName,
                    tabs: riskMap,
                    currentTab: "t6ttttt",
                    tabIndex: 0,
                    tab: {
                        name: req.params
                            .id,
                        text: "t6ttttt",
                        type:0
                    },
                    contents: [],
                    // isList: isList
                });
                return;

                var length=riskMap.length;
                if(length>0){
                    var name,currentIndex,i;
                    for(i=0;i<length;i++){
                        if(req.params.id==riskMap[i].id){
                            name=riskMap[i].name;
                            currentIndex=riskMap[i];
                            break;
                        }
                    }
                    if(name){
                       req.uest('/api/v2/cms/category/FXJY/name/' + encodeURIComponent(name) + '?sort' + 'PUBDATE')
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
                                    tabIndex: i,
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
                                    tabIndex: i,
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
                    }
                    
                }

            }
        });
        
    };
    router.get('/riskEducation/:id', function (req, res) {
        //风险教育
        renderPage("XXPL","风险教育","riskEducation");
    });
    router.get('/disclosure/:id', function (req, res) {
        //信息披露
        renderPage("FXJY","信息披露","disclosure");
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
