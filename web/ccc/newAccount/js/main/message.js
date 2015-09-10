'use strict';

//var ractive = new Ractive({
//	el:'.message-table',
//	template: require('ccc/newAccount/partials/messageTable.html'),
//	data:''
//});


'use strict';
var messageTpl = require('ccc/newAccount/partials/messageTable.html');
var utils = require('ccc/global/js/lib/utils');
var Tips = require('ccc/global/js/modules/cccTips');
require('ccc/global/js/modules/cccTab');

var pagesize = 10;
var page = 1;
var totalPage = 1;


$('.message-nav li a').click(function() {
	$(this).addClass('active');
	$(this).parent().siblings().children().removeClass('active');
	var type = $(this).parent().data('type');
	console.log(type);
	init(type);
});

function init (type) {
  if (type) {
    var messageRactive = new Ractive ({
      el: '.message-table',
      template: messageTpl,
      size: pagesize,
      page: page,
      totalPage: totalPage,
      moment: moment,
      api: '/api/v2/message/user/MYSELF/listByStatus',
      apit: '/api/v2/message/user/MYSELF/notifications',
      data: {
        loading: true,
        list: [],
        total: 0
      }, 
      onrender: function() {
        var self = this;
		  console.log('++++++++++');
		  console.log(this);
          self.getMessageData(function (o){
			  self.set('total',o.totalSize);
			  self.setData(o.results);
			  self.bindAction();
        });
      },
      getMessageData: function(callback) {
        var self = this;
        var API;
        if (type === 'ALL') {
          API = self.apit;
        } else {
          API = self.api + '?status=' + type + '&page=' + self.page + '&pageSize=' + self.size;
			console.log(API);
        };

        $.get(API,function (o){
          if (o.results.length) {
			  
            self.pageOneData = o.results;
			  console.log(o);
			  console.log('----');
			 console.log(self);
            callback(o);
          }
        });
      },
      bindAction : function () {
        $('.ctr').click(function (){
			if(type === 'NEW'){
				$(this).addClass('activeContent');
				$(this).parent().parent().siblings().children().children('.ctr').removeClass('activeContent');
				$(this).css('color','#4a4a4a');
				$(this).parent().siblings().css('color','#4a4a4a');
				$(this).parent().parent().css('backgroundColor','#e7e7e7');
				$(this).parent().parent().siblings().css('backgroundColor','#fff');
			}else{
				console.log('succss');
				$(this).addClass('activeContent');
				$(this).parent().parent().siblings().children().children('.ctr').removeClass('activeContent');
				$(this).parent().parent().css('backgroundColor','#e7e7e7');
				$(this).parent().parent().siblings().css('backgroundColor','#fff');
				}
        });
      },
      setData: function(o) {
        var self = this;
        self.set('loading', false);
        self.set('list', self.parseData(o));
        self.renderPageraa();
      },
      parseData: function(o) {
        for (var i = 0; i < o.length; i ++) {
          o[i].sentTime = moment(o[i].sentTime)
          .format("YYYY-MM-DD HH:mm:ss");
        }

        return o;
      },
      renderPageraa: function () {
        var self = this;
        var totalSize = self.get('total');
		 
        if (totalSize != 0) {
            self.totalPage = Math.ceil(totalSize / self.size);
			
        }
		  
        var totalPage = [];
		 // console.log(totalSize);
        for (var i = 0; i < self.totalPage ; i++) {
			
            totalPage[i] =i+1;
        }
		  
       console.log(totalPage);
        renderPager(totalPage, self.page);
      }
    });
  };
  
  messageRactive.on({
	  'showContent':function (event) {
		  			console.log(event);
					var id = event.node.getAttribute('data-id');
		  			console.log(id);
					var status = event.node.getAttribute('data-status');
		  			console.log(status);
					if (status == 'NEW') {
					$.get('/api/v2/message/markAsRead/' + id);
					}
			  },
	  'checkAll':function(){
		  			if($('#all-checkbox').is(':checked')){
						$('.check-box').each(function(){
							$('.check-box:checkbox').prop("checked",true);
							console.log(123);
						})
					}else{
						$('.check-box').each(function(){
							$('.check-box:checkbox').prop("checked",false);
							console.log(456);
						})
						
					}
		  				
	  },
	  'setMessage':function(){
		  var id = $('.ctr').data('id');
		  var status = $('.ctr').data('status');
		  console.log(id);
		  console.log(status);
		  if(status == 'NEW'){
			   var checked = $('.check-box').is(':checked');
			  	if(checked){
				$.get('/api/v2/message/markAsRead/' + id);
			  	alert('标记成功');
				init(status);
		  }
		  }else if(status == 'READ'){
			  var checked = $('.check-box').is(':checked');
			  if(checked){
				  alert('您已阅读了此消息');
			  	  init(status);
			  }
			 
		  }
		 
		  
	  }
  });

  function renderPager(totalPage, current) {
    if (!current) {
        current = 1;
    }
    var pagerRactive = new Ractive({
        el: '#invest-pager',
        template: require('ccc/invest/partials/pager.html'),
        data: {
            totalPage: totalPage,
            current: current
        }
    });

    pagerRactive.on('previous', function (e) {
		console.log('succss')
        e.original.preventDefault();
		console.log(e);
        var current = this.get('current');
        if (current > 1) {
            current -= 1;
            this.set('current', current);
            messageRactive.page = current;
            messageRactive.onrender();

        }
    });

    pagerRactive.on('page', function (e, page) {
		console.log('succss');
        e.original.preventDefault();
        if (page) {
            current = page;
        } else {
            current = e.context;
        }
        this.set('current', current);
        messageRactive.page = current;
        messageRactive.onrender();

    });
    pagerRactive.on('next', function (e) {
		console.log('succss');
        e.original.preventDefault();
        var current = this.get('current');
        if (current < this.get('totalPage')[this.get('totalPage')
                .length - 1]) {
            current += 1;
            this.set('current', current);
            messageRactive.page = current;
            messageRactive.onrender();
        }
    }); 
  }  
}


init('NEW');