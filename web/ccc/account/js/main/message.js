'use strict';

var utils = require('ccc/global/js/lib/utils');
var Tips = require('ccc/global/js/modules/cccTips');
require('ccc/global/js/modules/cccTab');

var messageTpl = require('ccc/account/partials/message.html');
var current = 0;
var pageContent = [];

var messages = {"results":[],"totalSize":0};
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
        for(var i = 0; i < pages; i++) {
           pageContent[i] = [];
           for(var j = 0; j < pageSize; j++) {
               if (messages.results.length) {
                    pageContent[i].push(messages.results.shift());
               }
           }
        }
    
}

function render(index) {
    messageRactive.set('message', pageContent[index]);
}

messageRactive.on('next', function() {
    var current = this.get('current');
    var totalPage = this.get('totalPage');
    if(current < totalPage){
        render(++current);
    }
    this.set('current',current);
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
    render(--page);
    this.set('current', page);
});

(function() {
    $.get('/api/v2/message/notifications/1/MYSELF', function(data) {
        messages = data;
        pages = Math.ceil(messages.totalSize / pageSize);
        setPage();
        render(current);
        messageRactive.set('pages', pageContent);
        messageRactive.set('totalPage', pages - 1);
    });
})();






