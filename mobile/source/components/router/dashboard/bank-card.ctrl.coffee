
do (_, angular) ->

    angular.module('controller').controller 'BankCardCtrl',

        _.ai '            @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams, @$interval', class
            constructor: (@user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams, @$interval) ->

                @$window.scrollTo 0, 0

                @$scope.bank_account = _.clone @user.bank_account
                @$scope.openId = @$routeParams.openId


                return unless @$scope.bank_account
                @api.payment_pool_banks().then (data) =>
                    @$scope.bank_account.bank_code = @$scope.bank_account.bank
                    @$scope.bank_account.bank = data[@$scope.bank_account.bank]

                @cell_buffering_count=120.119
                @cell_buffering=false
                @mobile_verification_code_has_sent=true
                @api.payment_pool_bank_limit(@$scope.bank_account.bank).then (data)=>
                    @$scope.limit=data.data


            changeBank: (password)->

                @$scope.clicked=false
                
                password = filterXSS(password)
                (@api.payment_pool_check_password(password)
                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (response) =>

                        @$location
                            .path '/dashboard/payment/bind-card'

                    .catch (response) =>
                        @$window.alert _.get response, 'error[0].message', 'something happened...'

                )

            send_mobile_captcha: ()->
                if typeof @user.bank_account=="undefined" || typeof @user.bank_account.bankMobile=="undefined"
                    @$timeout.cancel @error.timer
                    @error.on = true
                    @error.message = '手机号不存在！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return

                if typeof @user.bank_account=="undefined" || typeof @user.bank_account.account=="undefined"
                    @$timeout.cancel @error.timer
                    @error.on = true
                    @error.message = '银行卡号不存在！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return
            
                if typeof @user.bank_account=="undefined" || typeof @user.bank_account.name=="undefined"
                    @$timeout.cancel @error.timer
                    @error.on = true
                    @error.message = '用户名不正确！'
                    @error.timer = @$timeout =>
                        @error.on = false
                    , @error.timeout
                    return
                
                return unless !!@user.info and !!@user.info.id and !!@user.bank_account and !!@user.bank_account.bankMobile and !!@user.bank_account.account and !!@user.bank_account.name
               
                transtype='800006'

                (@api.payment_pool_send_captcha(@user.info.id,transtype,@user.bank_account.bankMobile,@user.bank_account.account,@user.bank_account.name)

                    .then (data) =>
                        return @$q.reject(data) unless data.status is 0
                        return data

                    .then (data) =>
                        
                        @smsid=data.data
                        timer = @$interval =>
                          @cell_buffering_count -= 1
                          
                          if @cell_buffering_count < 1
                              @$interval.cancel timer
                              @cell_buffering_count += 1000 * (@cell_buffering_count % 1)
                              @cell_buffering = false
                              
                        , 1000
                        @cell_buffering = true
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

                

