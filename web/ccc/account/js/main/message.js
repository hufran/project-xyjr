'use strict';

var $ = global.jQuery = require('jquery');
var utils = require('assets/js/lib/utils');
var Ractive = require('ractive/ractive-legacy');
var Tips = require('assets/js/modules/cccTips');
var moment = require('moment');
require('assets/js/modules/cccTab');

var messageTpl = require('ccc/account/partials/message.html');
var current = 0;
var pageContent = [];

var messages = {"results":[{"id":"53E2D9A0-69E5-41B7-9F4C-3ABF265F9534","body":{"title":"hello","content":"kjdkfjwkefjewfkjef","sentTime":1433906272000,"realm":"USER","type":"NOTIFICATION"},"sender":null,"receiver":"DF4FA1CC-DA39-4DF1-A8A6-F9F293BC98FD","status":"NEW","senderLoginName":null,"receiverLoginName":"tfzc_15527928085"},{"id":"9BA36934-7252-44DE-9A6B-90DDC0B049FA","body":{"title":"hello","content":"kjdkfjwkefjewfkjef","sentTime":1433906266000,"realm":"USER","type":"NOTIFICATION"},"sender":null,"receiver":"DF4FA1CC-DA39-4DF1-A8A6-F9F293BC98FD","status":"NEW","senderLoginName":null,"receiverLoginName":"tfzc_15527928085"},{"id":"5F5B6D41-F82D-4C65-B29B-76F7E552FF98","body":{"title":"hello","content":"ddd","sentTime":1433853693000,"realm":"USER","type":"NOTIFICATION"},"sender":null,"receiver":"DF4FA1CC-DA39-4DF1-A8A6-F9F293BC98FD","status":"NEW","senderLoginName":null,"receiverLoginName":"tfzc_15527928085"},{"id":"AD75A533-2B60-4F28-ADA1-2D68F194CAF2","body":{"title":"asdfasdf","content":"asdfadf鏈�1343","sentTime":1431927788000,"realm":"USER","type":"NOTIFICATION"},"sender":null,"receiver":"DF4FA1CC-DA39-4DF1-A8A6-F9F293BC98FD","status":"NEW","senderLoginName":null,"receiverLoginName":"tfzc_15527928085"}],"totalSize":4};
var pageSize = 5;
var pages=Math.ceil(messages.totalSize / pageSize);
var messageRactive = new Ractive({
    el: '.message-wrap',
    template: messageTpl,
    data: {
      moment: moment,
      clickCount: {},
      messages: [],
      message: [],
      current: current,
      totalPage: pages - 1
    }
});

function setPage(){
        var count=0;
        var page=1;
//        var pages=Math.ceil(messages.totalSize / pageSize);
        for(var i = 0; i < pages; i++) {
           pageContent[i] = [];
           for(var j = 0; j < pageSize; j++) {
               if (messages.results.length) {
                    pageContent[i].push(messages.results.shift());
               }
           }
        }
        console.log(pageContent);
    
}
setPage();
render(current);
messageRactive.set('pages', pageContent);
function render(index) {
    messageRactive.set('message', pageContent[index]);
}

messageRactive.on('next', function() {
   // var page = $(e.node).data('page');
    var current = this.get('current');
    var totalPage=this.get('totalPage');
    if(current<totalPage){
    render(++current);
    }
    this.set('current',current)
});
messageRactive.on('last',function(){
    var current=this.get('current');
    console.log(current);
    if(current >0){
    render(--current);
    }
    this.set('current',current);
});
messageRactive.on('current',function(e){
    var page = $(e.node).data('page');
    var current=this.get('current');
    render(--page);
     console.log(page);
    this.set('current', page);
})


//messageRactive.on('next', function() {
//    messages = [];
//    pagetSize = 5;
//    message = [];
//    current = 1
//    totalPage = Math.ceil totalSize / pageSize;
//    if current < totalPage
//    while(pageSize) {
//        message.push(messages.shift());
//        pagesize--;
//    }
//    current++
//    this.set('message', message);
//})

//$(".ccc-paging").each(function() {
//			$(this).cccPaging();
//});






