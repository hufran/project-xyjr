/*jshint unused: false*/

'use strict';

require('bootstrap/js/transition');
require('bootstrap/js/tooltip');
require('eonasdan-bootstrap-datetimepicker');
require('ccc/global/js/modules/cccTab');
require('ccc/global/js/modules/cccPaging');

var template = require('ccc/account/partials/integration/integration.html');
var utils = require('ccc/global/js/lib/utils');


var size = 10; // pageSize;

window.u = utils;

var pageOneData = {};

var ractive = new Ractive({
    el: $('.integration-ractive-container'),
    template: template,

    data: {
        tabIndex: 0,
        selectedIndex: 0, // 类别的selectedIndex
        list: [], // 数据,
        dateFrom: moment()
            .subtract(1, 'M') // 前1月
        .format('YYYY-MM-DD'),
        dateTo: moment()
        .format('YYYY-MM-DD')
    }
});

// 切换tab
$('.ccc-tab')
    .on('select', function (e) {
        ractive.set({
            tabIndex: e.index,
            selectedIndex: 0
        });
        loadInitData(e.index);
        return false;
    });


// datetime picker
$('.date-from-picker,.date-to-picker')
    .datetimepicker({
        language: 'zh-cn',
        pickTime: false
    })
    .find('input')
    .click(function () {
        $(this)
            .prev()
            .trigger('click');
        return false;
    });

// type
// page,pageSize
// preset
ractive.loadData = function (obj) {
    if (this.get('loading')) {
        return;
    }
    this.set('loading', true);
    size = obj.pageSize || size;
    var params= obj.params;
    params.page=1;
    params.pageSize=size;
    request.get(obj.api)
        .query(params)
        .end()
        .then(function (r) {
            ractive.set('loading', false);
            var res = r.body;

            if (!res) {
                return alert("获取数据失败...");
            }

            if (res.error) {
                alert(res.error + '\n' + res.error_description);
                return;
            }

            var list = res.results;
            if (obj.preset) {
                list.forEach(obj.preset);
            }
            // set first one data
            pageOneData = list;
            ractive.set('list', list);
            renderPage(res.totalSize, obj);
        });
};


// 先加载一遍数据
loadInitData(0);

// tab1,对ajax数据 set到ractive之前的操作



function loadInitData(index) {
    switch (index) {
    case 0:
        ractive.loadData({
            api:'/api/v2/points/user/'+CC.user.id+'/listAll',
            params:{
                 startDate: moment(ractive.get('dateFrom'))
                .unix() * 1000,
            endDate: moment(ractive.get('dateTo'))
                .unix() * 1000 + 1000*60*60*24 // 筛选时间加一天
           
            }
        });
        break;
    case 1:
        ractive.loadData({
           api:'/api/v2/points/user/'+CC.user.id+'/listAdds',
            params:{
           
            }
        });
        break;
    case 2:
        ractive.loadData({
           api:'/api/v2/points/user/'+CC.user.id+'/listReduced',
             params:{
            
            }
        });
        break;
    }
}

function renderPage(total, obj) {
    var self = ractive;
    var params = obj.params;
        params.pageSize=size;
    var api = obj.api + jsonToParams(params);
    $(".ccc-paging")
        .cccPaging({
            total: total,
            perpage: size,
            api: api,
            params: {
                type: 'GET',
                error: function (o) {
                    console.info('请求出现错误，' + o.statusText);
                }
            },
            onSelect: function (p, o) {
                if (o) {
                    switch (self.get('tabIndex')) {
                    case 0:
                        o = formatData(0, o);
                        break;
                    case 1:
                        o = formatData(1, o);
                        break;
                    case 2:
                        o = formatData(2, o);
                        break;

                    }
                } else {

                    o = {};
                }
                self.set('list', p > 1 ? o.results : pageOneData);
            }
        });
}

function jsonToParams(params) {
    var str = '';
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            str += '&' + key + '=' + params[key];
        }
    }
    return str;
}

function formatData(index, data) {
    console.log(data);

    for (var i = 0, l = data.results.length; i < l; i++) {
       
    }

    return data;
}

function isNumber (t) {
	var e = new RegExp('^[0-9]*$');
	return e.test(t)?!0:!1;
}
