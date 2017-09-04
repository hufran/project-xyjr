
do (_, angular) ->

    angular.module('controller').controller 'PaymentPoolRegisterCtrl',

        _.ai '        banks, @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams, @$interval', class
            constructor: (banks,@user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams, @$interval) ->

                @$window.scrollTo 0, 0

                @back_path = @$routeParams.back
                @next_path = @$routeParams.next or 'dashboard'

                @submit_sending = false
                @$scope.sourceId = @$routeParams.sourceId
                @$scope.banks=banks;
                num = (list for list of banks)
                @$scope.businessNull = num&&num.length
                @$scope.store={"bank_name":null}

                @error = {timer: null, timeout: 2000, message: '', on: false}
                @captcha = {timer: null, count: 120, count_default: 120, has_sent: false, buffering: false}
                @$scope.user=@user
                @cell_buffering = false
                @cell_buffering_count = 119.59
                
                console.log @user
                console.log banks

            send_mobile_captcha: (phonenumber,cardnbr,username)->
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

                if @user.info.lccbUserId && @user.bank_account
                    #换卡
                    transtype='800006'
                else
                    #开户
                    transtype='800001'

                @api.payment_pool_send_captcha(@user.info.id,transtype,phonenumber,cardnbr,username)
                    .then (data) =>
                        return @$q.reject(data) unless data.status is 0
                        return data
                    .then (data) =>
                        
                        @smsid=data.data
                        @captcha.timer = @$interval =>
                            @captcha.count -= 1

                            if @captcha.count < 1
                                @$interval.cancel @captcha.timer
                                @captcha.count = @captcha.count_default
                                @captcha.buffering = false
                        , 1000

                        @captcha.has_sent = @captcha.buffering = true


                    .catch (data) =>
                        @submit_sending = false
                        @$timeout.cancel @error.timer

                        @error.on = true
                        @error.message = _.get data, 'error[0].message', '系统繁忙，请稍后重试！'

                        @error.timer = @$timeout =>
                            @error.on = false
                        , @error.timeout
                


            open_payment_account: (user_name, id_number, card_no, bank_name, card_phone, smsCaptcha) ->
                
                if user_name != undefined
                    user_name = filterXSS user_name
                else
                    @error.on = true
                    @error.message =  '真实姓名为2 至 15 位中文！'

                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return;
                if id_number != undefined
                    id_number = filterXSS id_number
                else
                    @error.on = true
                    @error.message = '身份证号码不能为空！'

                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return
                if card_no!=undefined
                    card_no=filterXSS card_no
                else
                    @error.on = true
                    @error.message = '银行卡号不能为空！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return
                if bank_name!=undefined
                    bank_name=filterXSS bank_name
                else
                    @error.on = true
                    @error.message = '请选择所属银行！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return
                if card_phone!=undefined
                    card_phone=filterXSS card_phone
                else
                    @error.on = true
                    @error.message = '请输入手机号码！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return
                console.log "smsCaptcha:",smsCaptcha
                if smsCaptcha!=undefined
                    smsCaptcha=filterXSS smsCaptcha
                else
                    @error.on = true
                    @error.message = '请输入验证码！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return

                if @smsid!=undefined
                    smsid=@smsid
                else
                    @error.on = true
                    @error.message = '请发送验证码后再重试！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return

                return unless !!user_name and !!id_number and !!card_no and !!bank_name and !!card_phone and !!smsCaptcha and !!smsid
                @submit_sending = true

                if !@user.info.lccbUserId
                    #存管开户
                    (@api.payment_pool_custody_bind(@user.info.id,user_name, id_number, bank_name, card_no, card_phone, smsCaptcha, smsid)

                        .then (data) =>
                            return @$q.reject(data) unless data.success is true
                            return data

                        .then (data) =>
                            @user.info.name = user_name
                            @user.info.idNumber = id_number
                            @user.has_payment_account = true
                            if @$scope.sourceId != undefined
    #                           alert(wxChatUrl);
                                @$location
                                    .replace()
                                    .path wxChatUrl+"/lend/homeA"
                            else
                                @$location
                                    .replace()
                                    .path @next_path

                        .catch (data) =>
                            @submit_sending = false
                            @$timeout.cancel @error.timer

                            @error.on = true
                            @error.message = _.get data, 'error[0].message', '系统繁忙，请稍后重试！'

                            @error.timer = @$timeout =>
                                @error.on = false
                            , @error.timeout
                    )
                else if @user.info.lccbUserId&&@user.info.bank_account==undefined
                    #更换银行卡
                    @$window.alert "暂未开通该方法!"


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









    angular.module('directive').directive 'idNumber',

        _.ai 'checkChinaID', (checkChinaID) ->

            restrict: 'A'
            require: 'ngModel'

            link: (scope, element, attr, ngModel) ->

                ngModel.$parsers.push (value) ->
                    ('' + value).trim().toUpperCase()

                ngModel.$validators.id_number = checkChinaID
