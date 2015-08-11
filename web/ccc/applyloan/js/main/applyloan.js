var applyLoanService = require('../service/applyloan')
    .applyLoanService;
var CommonService = require('ccc/global/js/modules/common')
    .CommonService;
var validate = require('ccc/global/js/lib/jquery.validate.min');
var applyLoan = new Ractive({
    el: '#applyloan-page',
    template: require('../../partials/applyloan.html'),
//    init:function(){
//      if (!CC.user.id) {
//        // window.location.href = '/';
//      }
//    },
    data: {
        // 这里存放有关于注册用户的所有信息
        captcha: {
            img: '',
            token: ''
        },
        loan: {
            name:''
        }
    }
});

// 自定义表单验证
// 匹配手机号
$.validator.addMethod("mobile", function(value, element) {
    var length = value.length;
    var mobile = /(^1[3|5|8][0-9]{9}$)/;
    return this.optional(element) || (length == 11 &&mobile.test(value));
    }, "手机号码格式错误");

$.validator.addMethod("amount", function(value, element) {
    var length = value.length;
    var amount = /(^[^0][0-9]{0,}$)/;
    return this.optional(element) || (length <10 &&amount.test(value));
    }, "借款金额错误");
$.validator.addMethod("deadline", function(value, element) {
    var length = value.length;
    var deadline = /(^[^0|5|6|7|8|9][0-9]{0,2}$)/;
    return this.optional(element) || (value<=48&&deadline.test(value));
    },"借款期限格式有误，必须为小于48的正整数");

// 只能输入中文或英文
$.validator.addMethod("egchinese", function(value, element) {
        var chinese = /^[\u4e00-\u9fa5a-zA-Z]+$/;
        return this.optional(element) || (chinese.test(value));
    }, "只能输入中文或英文字母");

// 组织机构代码
$.validator.addMethod("organizing", function(value, element) {
        var organizing = /^([0-9a-z]){8}-[0-9|x]$/;
        return this.optional(element) || (organizing.test(value));
    }, "组织机构代码格式错误");

var v = $("#loanForm").validate({
       rules: {
        companyName: {
          required: true,        
          egchinese: true          
        },
        organizing:{
            required: true,
            organizing: true
        },
        personName: {
          required: true,
          egchinese: true              
        },
        mobilePhone: {
          required: true,
          minlength: 11,
          maxlength: 11,
          mobile:true
        },
        companyAddress: {
          required: true
        },
        loanMoney: {
          required: true,
          minlength: 1,
          maxlength: 9,
          amount:true    
        },
        guaranteeType: {
          required: true
        },
        deadline: {
          required: true,
          minlength: 1,
          maxlength: 2,
          deadline:true
        },
        contactAddress: {
          required: true
        },
        describe : {
          required: true
        },
        confirmCode: {
          required: true,
          minlength: 5,
          maxlength: 5
        }
      },
      messages: {
        companyName: {
          required: "请输入您的公司名称"
        },
        organizing:{
            required: "请输入组织机构代码"
        },
        personName: {
          required: "请输入您的名字"
        },
        mobilePhone: {
          required: "请输入您的手机号",
          minlength: "手机号码为11位",
          maxlength: "手机号码为11位"
        },
        companyAddress: {
          required: "请输入您的公司地址"
        },
        loanMoney: {
          required: "请输入借款金额",
          minlength: "借款金额不能为0",
          maxlength: "借款金额不能超过1亿"    
        },
        guaranteeType: {
          required: "请选择担保方式"
        },
        deadline: {
          required: "请输入借款期限",
          minlength: "借款期限不能为0",
          maxlength: "借款期限不能超过48个月"
        },
        contactAddress:{
            required: "请输入您的联系地址"
        },
        describe : {
          required: "请输入您的借款意图"
        },
        confirmCode: {
          required: "请输入验证码",
          minlength: "验证码为4位",
          maxlength: "验证码为4位"
        }
      },
      errorClass: "error",
      errorPlacement: function (error, element) { //指定错误信息位置
        if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
            var eid = element.attr('name'); //获取元素的name属性
            error.appendTo(element.parent().parent()); //将错误信息添加当前元素的父结点后面
        } else {
        error.insertAfter(element.parent());
        }
      }
       
    });


// 获取验证码
CommonService.getCaptcha(function (res) {
  applyLoan.set('captcha', {
        img: res.captcha,
        token: res.token
    });
});

applyLoan.on('changeCaptcha', function () {
    CommonService.getCaptcha(function (res) {
      applyLoan.set('captcha', {
            img: res.captcha,
            token: res.token
        });
    });
});

$('#sendApplyloan').click(function(){
    if(!v.form()) {
        return;
      } 
    var loan = {};
        
    loan.name = $("#companyName").val().trim();
    loan.mobile = parseInt($("#mobilePhone").val().trim());
    loan.amount = parseInt($("#loanMoney").val().trim());
//    loan.loanType = $("#guaranteeType").val();
    loan.loanType = $("#loanType").find("option:selected").val();
    loan.loanPurpose = $("#loanPurpose").find("option:selected").val();
//    loan.loanPurpose = $("#describe").val();
//    loan.months = parseInt($("#deadline").val());
    var months=parseInt($("#months").val().trim());
     loan.months = months%12;
    loan.year=parseInt(months/12);
    loan.coporationName = $("#personName").val();
    loan.address = $("#contactAddress").val();
    loan.status = 'PROPOSED';
   
    
    applyLoanService.addNew(loan, function (body) {
    
        if (body.success) {
               alert("申请借款成功");
            location.href ="/";
            } else {
                 alert("申请借款失败");
            }
    });

})



