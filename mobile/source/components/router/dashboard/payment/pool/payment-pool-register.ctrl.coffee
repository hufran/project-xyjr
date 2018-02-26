
do (_, angular) ->

    angular.module('controller').controller 'PaymentPoolRegisterCtrl',

        _.ai '        banks, @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams, @$interval, @$uibModal, @$sce', class
            constructor: (banks,@user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams, @$interval, @$uibModal, @$sce) ->

                @$window.scrollTo 0, 0

                @back_path = @$routeParams.back or 'dashboard'
                @next_path = @$routeParams.next or 'dashboard'

                @submit_sending = false
                @$scope.sourceId = @$routeParams.sourceId
                @$scope.banks=banks;
                num = (list for list of banks)
                @$scope.businessNull = num&&num.length
                @$scope.store={"bank_name":null}
                @$scope.btnContent="立即认证"

                @error = {timer: null, timeout: 2000, message: '', on: false}
                @captcha = {timer: null, count: 120, count_default: 120, has_sent: false, buffering: false}
                @$scope.user=@user
                @cell_buffering = false
                @cell_buffering_count = 120.119
                @successUrl=@$window.location.origin+"/h5/dashboard"

                @api.payment_pool_getLccbId(@user.info.id)
                    .then (data) =>
                        return @$q.reject(data) unless data.status is 0
                        return data

                    .then (data) =>
                        @$scope.lccbUserId=data.data.lccbId
                        @$scope.lccbAuth=data.data.lccbAuth

                        if parseInt(@$scope.lccbUserId)==0
                            @$scope.btnContent="立即激活"
                        else if parseInt(@$scope.lccbUserId)==-1
                            @$scope.btnContent="确认开通"
                        else if @$scope.lccbAuth==false
                            @$scope.btnContent="立即授权"
                    .catch (data) =>
                        @$window.alert "获取廊坊银行用户ID失败！"

                console.log @user
                console.log banks

                if @$scope.user.info&&@$scope.user.info.name
                    length=@$scope.user.info.name.length
                    @$scope.user_name=@$scope.user.info.name.substring(0,1)+@$scope.user.info.name.substring(1,length-1).replace(/./g,"*")+@$scope.user.info.name.substring(length-1)

                if @$scope.user.info&&@$scope.user.info.idNumber
                    length=@$scope.user.info.idNumber.length
                    @$scope.user_idNumber=@$scope.user.info.idNumber.substring(0,4)+@$scope.user.info.idNumber.substring(4,length-4).replace(/./g,"*")+@$scope.user.info.idNumber.substring(length-4)

                if @$scope.user.bank_account&&@$scope.user.bank_account.account
                    length=@$scope.user.bank_account.account.length
                    @$scope.user_account=@$scope.user.bank_account.account.substring(0,4)+@$scope.user.bank_account.account.substring(4,length-4).replace(/./g,"*")+@$scope.user.bank_account.account.substring(length-4)

                if @$scope.user.bank_account&&@$scope.user.bank_account.bankMobile
                    length=@$scope.user.bank_account.bankMobile.length
                    @$scope.user_bankMobile=@$scope.user.bank_account.bankMobile.substring(0,3)+@$scope.user.bank_account.bankMobile.substring(3,length-4).replace(/./g,"*")+@$scope.user.bank_account.bankMobile.substring(length-4)

            send_mobile_captcha: (phonenumber,cardnbr,username)->
                if @captcha.timer
                    @$interval.cancel @captcha.timer
                    @captcha.timer=null
                    @captcha.count = @captcha.count_default
                    @captcha.buffering = false
                if !phonenumber || !(/^([1][3|5|7|8][0-9]{9})$/.test(phonenumber))
                    @$timeout.cancel @error.timer
                    @error.on = true
                    @error.message = '手机号不正确！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return
                else
                    phonenumber=filterXSS phonenumber

                if !cardnbr || !/^\d{16,19}$/.test(cardnbr)
                    @$timeout.cancel @error.timer
                    @error.on = true
                    @error.message = '银行卡号不正确！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return
                else
                    cardnbr=filterXSS cardnbr

                if !username || !(/^[\u4e00-\u9fa5]+((·|•|●)[\u4e00-\u9fa5]+)*$/.test(username))
                    @$timeout.cancel @error.timer
                    @error.on = true
                    @error.message = '用户名不正确！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return
                else
                    username=filterXSS username
                return unless !!phonenumber and !!cardnbr and !!username
                
                if parseInt(@$scope.lccbUserId)==-1
                    #开户
                    transtype='800001'
                else if parseInt(@$scope.lccbUserId)==0
                    #激活
                    transtype='800031'
                else 
                    #授权
                    transtype='800027'


                @api.payment_pool_send_captcha(@user.info.id,transtype,phonenumber,cardnbr,username)
                    .then (data) =>
                        return @$q.reject(data) unless data.status is 0
                        return data
                    .then (data) =>
                        
                        @smsid=data.data
                        @captcha.timer = @$interval =>
                            @captcha.count -= 1

                            if @captcha.count < 1
                                @smsid=null
                                @$interval.cancel @captcha.timer
                                @captcha.timer=null
                                @captcha.count = @captcha.count_default
                                @captcha.buffering = false
                        , 1000

                        @captcha.has_sent = @captcha.buffering = true


                    .catch (data) =>
                        @submit_sending = false
                        @$timeout.cancel @error.timer

                        @error.on = true
                        @error.message = _.get data, 'msg', '系统繁忙，请稍后重试！'

                        @error.timer = @$timeout =>
                            @error.on = false
                        , @error.timeout
                


            open_payment_account: (event,user_name, id_number) ->
                event.preventDefault();
                if typeof user_name != "undefined"
                    user_name = filterXSS user_name
                else
                    @error.on = true
                    @error.message =  '真实姓名为2 至 15 位中文！'

                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return;
                if typeof id_number != "undefined"
                    id_number = filterXSS id_number
                else
                    @error.on = true
                    @error.message = '身份证号码不能为空！'

                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return
                #if parseInt(@$scope.lccbUserId)!=-1
                #    if typeof card_no!="undefined"
                #        card_no=filterXSS card_no
                #    else
                #        @error.on = true
                #        @error.message = '银行卡号不能为空！'
                #        @error.timer = @$timeout =>
                #            @error.on = false
                #        , @error.timeout
                #        return
                #    if typeof bank_name!="undefined"
                #        bank_name=filterXSS bank_name
                #    else
                #        @error.on = true
                #        @error.message = '请选择所属银行！'
                #        @error.timer = @$timeout =>
                #            @error.on = false
                #        , @error.timeout
                #        return
                #    if typeof card_phone!="undefined"
                #        card_phone=filterXSS card_phone
                #    else
                #        @error.on = true
                #        @error.message = '请输入手机号码！'
                #        @error.timer = @$timeout =>
                #            @error.on = false
                #        , @error.timeout
                #        return
            

                
                return unless !!user_name and !!id_number
                @submit_sending = true

                if parseInt(@$scope.lccbUserId)==-1
                    #存管开户
                    (@api.payment_pool_lccb_register(@user.info.id,user_name,id_number,@successUrl)
                        .then (data) =>
                            return @$q.reject(data) unless data.status is 0
                            return data
                        .then (data) =>
                            @$window.form.action=data.data
                            do @$window.form.submit
                        .catch (data) =>
                            @submit_sending = false
                            @$timeout.cancel @error.timer

                            @error.on = true
                            @error.message = _.get data, 'error[0].message', '系统繁忙，请稍后重试！'

                            @error.timer = @$timeout =>
                                @error.on = false
                            , @error.timeout
                    )

                else if parseInt(@$scope.lccbUserId)==0
                    #存管激活
                    @api.payment_pool_lccb_userActivate(@user.info.id,@$window.location.href)
                        .then (data) =>
                            return @$q.reject(data) unless data.status is 0
                            return data
                        .then (data) =>
                            @$window.form.action=data.data
                            do @$window.form.submit
                        .catch (data) =>
                            @submit_sending = false
                            @$timeout.cancel @error.timer

                            @error.on = true
                            @error.message = _.get data, 'msg', '系统繁忙，请稍后重试！'

                            @error.timer = @$timeout =>
                                @error.on = false
                            , @error.timeout
                    

                else if parseInt(@$scope.lccbUserId)!=0&&parseInt(@$scope.lccbUserId)!=-1&&@$scope.lccbAuth==false
                    #用户授权操作
                    @api.payment_pool_lccb_accredit(@user.info.id,@successUrl)
                        .then (data)=>
                            return @$q.reject(data) unless data.status is 0
                            return data
                        .then (data) =>
                            @$window.form.action=data.data
                            do @$window.form.submit
                        .catch (data) =>
                            @submit_sending = false
                            @$timeout.cancel @error.timer

                            @error.on = true
                            @error.message = _.get data, 'msg', '系统繁忙，请稍后重试！'

                            @error.timer = @$timeout =>
                                @error.on = false
                            , @error.timeout

                else if parseInt(@$scope.lccbUserId)!=0&&parseInt(@$scope.lccbUserId)!=-1&&@$scope.lccbAuth==true
                    #取消授权操作
                    @$window.alert "取消授权"
                    @window.alert "暂未开通取消授权方法"

            agreement: (segment) ->

                prompt = @$uibModal.open {
                    size: 'lg'
                    backdrop: 'static'
                    windowClass: 'center'
                    animation: true
                    templateUrl: 'ngt-register-agreement.tmpl'

                    resolve: {
                        content: _.ai '$http', ($http) ->
                            $http
                                .get "/api/v2/cms/category/DECLARATION/name/#{ segment }", {cache: true}
                                .then (response) -> _.get response.data, '[0].content'
                    }

                    controller: _.ai '$scope, content',
                        (             $scope, content) ->
                            angular.extend $scope, {content}
                }

                once = @$scope.$on '$locationChangeStart', ->
                    prompt?.dismiss()
                    do once

            jumpUrl: ()->
                if parseInt(@$scope.lccbUserId)!=0&&parseInt(@$scope.lccbUserId)!=-1
                    @$location.path 'dashboard/bank-card'
                else
                    return false







    angular.module('directive').directive 'idNumber',

        _.ai 'checkChinaID', (checkChinaID) ->

            restrict: 'A'
            require: 'ngModel'

            link: (scope, element, attr, ngModel) ->

                ngModel.$parsers.push (value) ->
                    ('' + value).trim().toUpperCase()

                ngModel.$validators.id_number = checkChinaID
