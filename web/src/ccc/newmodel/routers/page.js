'use strict';
module.exports = function (router) {
var pageSize = 10;var riskList=["公司信息","治理信息","风控体系","运营信息","平台信息","审计报告","合规报告","信息安全","重大事件"],disclosureList=["法律法规","借贷知识普及","出借人风险教育"];
    function renderPage(req,res,next,category,titleName,urlName,type){
        var riskMap=[];
        req.uest("/api/v2/cms/channels").end().then(function(r){

            if(r.body.length >= 1){

                var length=r.body.length,i,infoList,listLength;
                //定义数组顺序
                
                if(category=="FXJY"){
                    //风险教育
                    infoList=disclosureList;
                }else if(category=="XXPL"){
                    //信息纰漏
                    infoList=riskList;
                }
                listLength=infoList.length;
                for(var j=0;j<listLength;j++){
                    for(i=0;i<length;i++){
                        if(r.body[i].category===category&&infoList[j]==r.body[i].name){
                            riskMap.push({id:r.body[i].id,name:r.body[i].name,url:"/newmodel/"+urlName+"/"+r.body[i].id});
                        }
                    }
                }
                
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

                            formatNews(r.body);
                            var contents = r.body.length >
                                    0 ? r.body : null;
                            if (contents.length > 1) {
                                var current = (req.query.page === undefined) ? 1 : req.query.page;
                                var len=contents.length,results=[];
                                for(var i=0;i<len;i++){
                                    if(contents[i].channelId==req.params.id){
                                        results.push(contents[i]);
                                    }
                                }

                                var startIndex=(current-1)*pageSize,endIndex=startIndex+(pageSize-1),resultArray;
                                if(results.length/pageSize<=current){
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
                                    tabs: JSON.stringify(riskMap),
                                    currentTab: currentIndex["name"],
                                    tabIndex: indexValue,
                                    tab: {
                                        name: req.params
                                            .id,
                                        text: currentIndex["name"],
                                        type:type
                                    },
                                    contents: JSON.stringify(resultArray),
                                    // isList: isList
                                });


                            }else{
                                
                                res.render('index', {
                                    titleName:titleName,
                                    tabs: JSON.stringify(riskMap),
                                    currentTab: currentIndex["name"],
                                    tabIndex: indexValue,
                                    tab: {
                                        name: req.params
                                            .id,
                                        text: currentIndex["name"],
                                        type:type
                                    },
                                    contents: JSON.stringify(contents),
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
        renderPage(req, res, next,"FXJY","风险教育","riskEducation",1);
    });
    router.get('/disclosure/:id', function (req, res, next) {
        //信息披露
        renderPage(req, res, next,"XXPL","信息披露","disclosure",0);
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
