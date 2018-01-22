
do (_, angular) ->

    angular.module('controller').controller 'BankCardCtrl',

        _.ai '            @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams, @$interval', class
            constructor: (@user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams, @$interval) ->

                @$window.scrollTo 0, 0

                @$scope.bank_account = _.clone @user.bank_account
                @$scope.openId = @$routeParams.openId
                @$scope.clicked=false

                return unless @$scope.bank_account
                @api.payment_pool_banks().then (data) =>
                    @$scope.bank_account.bank_code = @$scope.bank_account.bank
                    @$scope.bank_account.bank = data[@$scope.bank_account.bank]

                @cell_buffering_count=59.59
                @cell_buffering=false
                @mobile_verification_code_has_sent=true
                @api.payment_pool_bank_limit(@$scope.bank_account.bank).then (data)=>
                    @$scope.limit=data.data

            validateChangeBank:()->
                #验证用户是否可以更换银行卡
                if !@user.info.id
                    @$window.alert "用户id不能为空！"
                    return
                return unless !!@user.info and !!@user.info.id
                (@api.payment_pool_lccb_checkIsChangeBank(@user.info.id)
                    .then (data) =>
                        return @$q.reject(data) unless data.status is 0
                        return data
                    .then (data) =>
                        if data.data==true
                            @$scope.clicked = true
                        else
                            @$window.alert _.get data, 'msg', 'something happened...'
                    .catch (response) =>
                        @$window.alert _.get response, 'msg', 'something happened...'
                )



            changeBank: (tel)->

                if !@user.info.id
                    @$window.alert "用户id不能为空！"
                    return
                if !tel
                    @$window.alert "验证码不能为空"
                    return
                else
                    tel = filterXSS(tel)
                return unless !!@user.info and !!@user.info.id and !!tel
                console.log "tel:"+tel
                (@api.payment_pool_lccb_checkOldMobile(@user.info.id,tel)
                    .then (data) =>
                        return @$q.reject(data) unless data.status is 0
                        return data

                    .then (response) =>
                        if response.data==true
                            @$scope.clicked=false
                            @$location
                                .path '/dashboard/payment/bind-card'
                        else
                            @$window.alert '验证码不正确！'
                    .catch (response) =>
                        @$window.alert _.get response, 'msg', 'something happened...'

                )

            send_mobile_captcha: ()->
                if !@user.info.id
                    @$window.alert "用户id不能为空！"
                    return
                
                return unless !!@user.info and !!@user.info.id

                (@api.payment_pool_lccb_sendOldMobile(@user.info.id)

                    .then (data) =>
                        return @$q.reject(data) unless data.status is 0
                        return data

                    .then (data) =>
                        if data.data==true
                            timer = @$interval =>
                              @cell_buffering_count -= 1
                              
                              if @cell_buffering_count < 1
                                  @$interval.cancel timer
                                  @cell_buffering_count += 100 * (@cell_buffering_count % 1)
                                  @cell_buffering = false
                                  
                            , 1000
                            @cell_buffering = true
                            @mobile_verification_code_has_sent = false
                        else
                            key = _.get data, 'msg'
                            @$window.alert "短信发送失败,"+key
                            @mobile_verification_code_has_sent = false
                    .catch (data) =>

                        key = _.get data, 'msg'
                        @$window.alert "短信发送失败,"+key
                        @mobile_verification_code_has_sent = false
                    
                )
            

            unbind: (account, password) ->
                password = filterXSS(password)
                (@api.payment_pool_unbind_card(account, password)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (response) =>
                        @$window.alert response.data

                    .catch (response) =>
                        @$window.alert _.get response, 'error[0].message', 'something happened...'

                    .finally =>
                        @$location
                            .path 'dashboard'
                            .search t: _.now()

                        @$scope.$on '$locationChangeStart', (event, new_path) =>
                            event.preventDefault()
                            @$location
                                .path new_path
                )

                

