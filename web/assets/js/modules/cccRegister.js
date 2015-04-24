'use strict';
/**
 * 通用注册模块
 */

var $ = global.jQuery = require('jquery');
var Ractive = require('ractive/ractive-legacy');
var service = require('assets/js/service/register');
var Agreement = require('assets/js/modules/cccAgreement');
var LoginService = require('assets/js/service/login');
var CommonService = require('assets/js/modules/common')
    .CommonService;
var utils = require('assets/js/lib/utils');
//require('assets/js/lib/select2css');
//var industryInfos = require('ccc/insurance/js/industry.json');
//var workerInfos = require('ccc/insurance/js/worker.json');
//var provinceInfos = require('ccc/insurance/js/province.json'); // province 信息
//var cityInfos = require('ccc/insurance/js/city.json'); // 城市信息
//var areaInfos = require('ccc/insurance/js/area.json'); // 区/县 信息

module.exports = function (options) {
    
    var defaults = {
        el: $('.register-wrap'),
        template: require('partials/register/step.html'),
        user: CC.user,
        step: {
            show: true,
            current: CC.user && CC.user.loginName ? 2:1
        },
        salary: null,
        fastMode: false,
        popup: false, // 是否是popup形式的切换(主要是在login和register视图之间的切换)
        agreementType: 'popup',
        redirectWhenSuccess: '/account',
        smsCaptchaWaitTime: 60, // 手机短信发送时间间隔(s)
        changeToLogin: function(){},
        debug: false
    };
    
    var config = {};
	$.extend(config, defaults, options);
    
    var registerRac = new Ractive({
        el: config.el,
        template: config.template,
        data: {
            msg: {},
            user: config.user,
            step: {
                show: config.step.show,
                current: config.step.current
            },
            //provinceInfos: provinceInfos,
            //area: Area,
            citys: [],
            //industry: industryInfos,
            jobs: [],
            countTime: 5, // 最后一步转跳时间
            agreementType: config.agreementType,
            popup: config.popup,
            ACCESS: false // 是否允许提交数据
        },
        partials: {
            step1: require('partials/register/step1.html'),
            step2: require('partials/register/step2.html'),
            step3: require('partials/register/step3.html')
        },
        validateForm: [
            'loginName',
            'mobile',
            'password',
            'repassword',
            'smsCaptcha',
            'agreement'
        ],
        defaultEmail: 'null@creditcloud.com',
        oninit: function () {},
        oncomplete: function () {
            this.$regForm = $(this.el).find('form[name=regForm]');
            this.$postStep1 = $(this.el).find('button.post-btn-step1');
            this.$loginName = $(this.el).find('input[name=loginName]');
            this.$mobile = $(this.el).find('input[name=mobile]');
            this.$smsCaptcha = $(this.el).find('input[name=smsCaptcha]');
            this.$password = $(this.el).find('input[name=password]');
            this.$repassword = $(this.el).find('input[name=repassword]');
            this.$agreement = $(this.el).find('input[name=agreement]');
            
            this.service = service;
            
            this.bindActions();
            this.bindStep2Actions();
            this.bindEvents();
        },
        bindActions: function () {
            var self = this;
            
            // 注册服务协议弹窗
            $('.ccc-agreement').click(function(){
                Agreement({
                    title: '世纪金融注册服务协议',
                    ok: function() {
                        self.clearMsg('agreement');
                    }
                });
                return false;
            });
            
            this.$loginName.blur(function() {
                if (self.$loginName.val() === '') {
                    return false;
                }
                self.service.checkLoginName(self.$loginName.val(), function (flag, error) {
                    if (config.debug) {
                        console.log('debug:register:ckLoginName', flag, error);
                    }
                    if (!flag) {
                        self.showMsg(utils.errorMsg[error[0].message], 'loginName');
                    } else {
                        self.clearMsg('loginName');
                    }
                });
            });

            this.$mobile.blur(function() {
                if (self.$mobile.val() === '') {
                    return false;
                }
                if (!utils.match.mobile(self.$mobile.val())) {
                    self.showMsg(utils.errorMsg.MOBILE_INVALID, 'mobile');
                    return false;
                }
                self.service.checkMobile(self.$mobile.val(), function (flag, error) {
                    if (!flag) {
                        self.showMsg(utils.errorMsg[error[0].message], 'mobile');
                    } else {
                        self.clearMsg('mobile');
                    }
                });
            });
            
            this.$smsCaptcha.blur(function() {
                var v = self.$smsCaptcha.val();
                if (v.length > 0) {
                    if (v.length != 6) {
                        self.showMsg('验证码为6位字串', 'smsCaptcha');
                    } else {
                        self.clearMsg('smsCaptcha');
                    }
                }
            });
            
            this.$password.blur(function(){
                var v = self.$password.val();
                v = v.replace(' ', '');
                if (v.length > 0) {
                    if (v.length < 6 || v.length > 20) {
                        self.showMsg(utils.errorMsg.PASSWORD_LENGTH, 'password');
                    } else {
                        self.clearMsg('password');
                    }
                }
            });
            
            this.$repassword.blur(function(){
                var v = self.$repassword.val();
                if (v.length > 0) {
                    if (v !== self.$password.val()) {
                        self.showMsg(utils.errorMsg.PASSWORD_AGAIN_INVALID, 'repassword');
                    } else {
                        self.clearMsg('repassword');
                    }
                }
            });
            
            this.$regForm.submit(function(e){
                var $this = $(this);
                if (e && e.preventDefault){
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
                
                if (self.$postStep1.hasClass('disabled')) {
                    return;
                }
                
                self.set('ACCESS', true);
                
                if (config.debug) {
                    console.log('debug:register:submit', $(this).serialize());
                }
                
                $.each(self.validateForm, function (index, value) {
                    var ele = $(self.el).find('[name=' + value + ']');
                    if (value !== 'agreement') {
                        if (!ele.val().length) {
                            self.showMsg(utils.errorMsg[value.toUpperCase() + '_NULL'], value);
                        } else {
                            self.clearMsg(value);
                        }
                    } else {
                        if (!ele.prop('checked')) {
                            self.showMsg(utils.errorMsg.AGREEMENT_NULL, value);
                        } else {
                            self.clearMsg(value);
                        }
                    }
                });
                
                if (!self.get('ACCESS')) {
                    return;
                }
                
                if (!utils.match.mobile(self.$mobile.val())) {
                    self.showMsg(utils.errorMsg.MOBILE_INVALID, 'mobile');
                    return;
                }
                
                self.beforeRegister();
                
                self.service.checkLoginName(self.$loginName.val(), function (flag, error) {
                    if (config.debug) {
                        console.log('debug:register:ckLoginName', flag, error);
                    }
                    if (!flag) {
                        self.showMsg(utils.errorMsg[error[0].message], 'loginName');
                    } else {
                        self.clearMsg('loginName');
                        self.service.checkMobile(self.$mobile.val(), function (flag, error) {
                            if (!flag) {
                                self.showMsg(utils.errorMsg[error[0].message], 'mobile');
                            } else {
                                self.clearMsg('mobile');
                                
                                var userData = {
                                    loginName: self.$loginName.val(),
                                    password: self.$password.val(),
                                    mobile: self.$mobile.val(),
                                    email: self.defaultEmail,
                                    mobile_captcha: self.$smsCaptcha.val()
                                };
                                
                                self.service.doRegister(userData, function (r, error) {
                                    self.regCallback(userData, r, error);
                                });
                            }
                        });
                    }
                });
            });
        },
        stepTwoVer: [
            'userName',
            'idNumber',
            'email',
            'city',
            'jobs'
        ],
        bindStep2Actions: function () {
            var self = this;
            // step2 el
            this.$postStep2 = $('button.post-btn-step2');
            
            
            
            
            $('.srbtn-c').on('click', function(e){
                var $this = $(this);
                var value = $(this).data('value');
                $('.srbtn-c.selected').removeClass('selected');
                $this.addClass('selected');
                self.set('salary', value);
                $('[name=salary]').val(value);
                self.clearMsg('salary');
            });
            
            $.each(this.stepTwoVer, function (index, value) {
                var ele = $('[name=' + value + ']');
                ele.focusin(function(){
                    self.clearMsg(value);
                });
            });
            
            $('.tag_select_wrap').on('click', function(){
                self.clearMsg($(this).parent().parent().parent().data('key'));
            });
            
            $('form[name=regFormStep2]').submit(function(e){
                var $this = $(this);
                if (e && e.preventDefault){
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
                
                if (self.$postStep2.hasClass('disabled')) {
                    return;
                }
                
                self.set('ACCESS', true);
                
                if (config.debug) {
                    console.log('debug:register:step2:submit', $(this).serialize());
                }
                
                $.each(self.stepTwoVer, function (index, value) {
                    var ele = $('[name=' + value + ']');
                    if (!ele.val().length) {
                        self.showMsg(ele.data('text') + '不能为空', value);
                    } else {
                        self.clearMsg(value);
                    }
                });
                
                var $idNumber = $('[name=regFormStep2] [name=idNumber]');
                if ($idNumber.val() !== '') {
                    var _ver = utils.formValidator.checkIdNumber($idNumber.val());
                    if (!_ver.success) {
                        self.showMsg('身份证号格式错误', 'idNumber');
                    } else {
                        self.clearMsg('idNumber');
                    }
                }
                
                var $email = $('[name=regFormStep2] [name=email]');
                if ($email.val() !== '') {
                    if (!utils.match.email($email.val())) {
                        self.showMsg('邮箱格式错误', 'email');
                    } else {
                        self.clearMsg('email');
                    }
                }
                
                if (!self.get('salary')) {
                    self.showMsg('请选择年收入', 'salary');
                } else {
                    self.clearMsg('salary');
                }
                
                if (!self.get('ACCESS')) {
                    return;
                }
                
                var api = '/api/v2/user/MYSELF/update/userInfo';
                $.post(api, $this.serialize(), function(r){
                    if (r.success) {
                        LoginService.login({
                            loginName: self.loginName,
                            password: self.password
                        }, function (result) {
                            if (result.success) {
                                self.fire('goNext');
                                CC.user = result.user;
                            } else {
                                location.href = '/login';
                            }
                        });
                    } else {
                        self.showMsg('信息保存失败，您可以在个人中心重新尝试编辑', 'updateErr');
                        setTimeout(function(){
                            self.fire('goNext');
                        }, 4000);
                    }
                }).error(function(r){
                    self.showMsg('信息保存失败：' + r.statusText, 'updateErr');
                    setTimeout(function(){
                        self.fire('goNext');
                    }, 4000);
                });
            });
        },
        
        bindEvents: function () {
            var self = this;
            this.on('getcaptcha', function(e){
                var $this = $(e.node);
                if ($this.hasClass('disabled')) {
                    return;
                }
                if (self.$mobile.val() === '') {
                    self.showMsg(utils.errorMsg.MOBILE_NULL, 'mobile');
                    return;
                }
                self.service.checkMobile(self.$mobile.val(), function (flag, error) {
                    if (!flag) {
                        self.showMsg(utils.errorMsg[error[0].message], 'mobile');
                    } else {
                        CommonService.getSmsCaptcha(self.$mobile.val(), function (r) {
                            if (r.success) {
                                self.countDown($this);
                            }
                        });
                    }
                });
            });
            
            // 跳过第二步
            this.on('goNext', function(){
                self.set('step.current', 3);
                self.startCountDownRedirect();
            });
            
            // 切换到popup login视图
            this.on('changeToLogin', function(e){
                config.changeToLogin(self, $(e.node));
                return false;
            });
        },
        
        startCountDownRedirect: function () {
            var self = this;
            setInterval(function() {
                var _time = self.get('countTime');
                if (_time === 0) {
                    location.href = config.redirectWhenSuccess;
                } else {
                    self.set('countTime', --_time);
                }
            }, 1000);
        },
        
        countDown: function (obj) {
            obj.addClass('disabled');
            var previousText = '获取验证码';
            var msg = '$秒后重新发送';

            var left = config.smsCaptchaWaitTime;
            var interval = setInterval((function () {
                if (left > 0) {
                    obj.html(msg.replace('$', left--));
                } else {
                    obj.html(previousText);
                    obj.removeClass('disabled');
                    clearInterval(interval);
                }
            }), 1000);
        },
        
        beforeRegister: function () {
            this.$postStep1.addClass('disabled');
        },
        
        regCallback: function (user, r, error) {
            var self = this;
            self.loginName = user.loginName;
            self.password = user.password;
            if (r.success) {
                LoginService.login({
                    loginName: user.loginName,
                    password: user.password
                }, function (result) {
                    //location.href = config.redirectWhenSuccess;
                    if (result.success) {
                        CC.user = result.user;
                        if (config.fastMode) {
                            self.set('step.current', 3);
                            self.startCountDownRedirect();
                        } else {
                            self.set('step.current', 2);
                            self.bindStep2Actions();
                        }
                    } else {
                        location.href = '/login';
                    }
                });
            } else {
                this.showMsg(utils.errorMsg[error[0].message], 'post');
                setTimeout(function(){
                   self.clearMsg('post');
                }, 4000);
            }
        },
        
        resetForm: function () {
            this.$postStep1.removeClass('disabled');
        },
        
        showMsg: function (msg, key) {
            this.set('ACCESS', false);
            this.resetForm();
            this.set('msg.' + key, msg);
        },
        clearMsg: function (key) {
            this.set('msg.' + key, null);
        }
    });
    
    return registerRac;
};

/*
function getProvince(code) {
    if (!code) return;
    return provinceInfos.filter(function(item){
        return item.provinceCode.substring(0, 2) === code.toString().substring(0, 2);
    });
}
function getCity(code) {
    if (!code) return;
    return cityInfos.filter(function(item){
        return item.cityCode === code.toString();
    });
}
function getCountry(code) {
    if (!code) return;
    return areaInfos.filter(function(item){
        return item.areaCode === code.toString();
    });
}

function getCityByProvince(province) {
    return cityInfos.filter(function(item) {
        return item.cityCode.substring(0, 2) === province.substring(0, 2);
    });
}
function getCountryByCity(city) {
    return areaInfos.filter(function(item) {
        return item.areaCode.substring(0, 4) === city.substring(0, 4);
    });
}
*/