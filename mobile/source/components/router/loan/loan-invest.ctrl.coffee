
do (_, angular, Math) ->

    angular.module('controller').controller 'LoanInvestCtrl',

        _.ai '            @api, @user, @loan, @coupon, @$scope, @$q, @$location, @$window, map_loan_summary, @$uibModal, @mg_alert, @$routeParams, @$interval', class
            constructor: (@api, @user, @loan, @coupon, @$scope, @$q, @$location, @$window, map_loan_summary, @$uibModal, @mg_alert, @$routeParams, @$interval) ->

                @$window.scrollTo 0, 0

                #@newCoupon_list(@user.fund.userId);
                @getAgreement_name(@loan.id)
                .then (data) =>
#                    console.log data.productName
                    @$scope.agreement_name = data.productName


                @page_path = @$location.path()[1..]
                @page_path_origin = ARRAY_JOIN_SLASH.call ['loan', @loan.id, 'invest']
                arrList = [@user.fund.availableAmount*1,@loan.balance*1,@loan.loanRequest.investRule.minAmount*1,@loan.loanRequest.investRule.maxAmount*1]
                sortNumer= (a,b) -> a-b
                arrList.sort(sortNumer)
                @$scope.maxMoney = arrList[1]
                @$scope.minMoney = arrList[0]

                @api.payment_pool_getLccbId(@user.info.id)
                    .then (data) =>
                        return @$q.reject(data) unless data.status is 0
                        return data

                    .then (data) =>
                        @$scope.lccbAuth=data.data.lccbAuth
                        if data.data.lccbId=="0"
                            @$scope.btnContent="立即激活"
                    .catch (data) =>
                        @$window.alert "获取廊坊银行用户ID失败！"

                console.log "user:",@user

                

                angular.extend @$scope, {
                    store: {}
#                    abc: @coupon.data[0].actualAmount
                    earning: 0
                    loan: map_loan_summary @loan
					#@coupon = @newCoupon_list(@user.fund.userId)

                    coupon_list:
                        #_(@newCoupon_list(@user.fund.userId))
                        _(@coupon.data)
                        #_(@coupon.data)
                            #.filter (item) -> item.disabled is false
                            #.pluck 'placement'
                            #.filter (item) -> item.id isnt 'null'
                            .map (item) ->
                                info = item.couponPackage

                                return {
                                    id: item.id
                                    minimum: info.minimumInvest
                                    actualAm: item.actualAmount
                                    display: do ->
                                        INTEREST = 'INTEREST'

                                        type_cn = {
                                            CASH: '现金券'
                                            INTEREST: '加息券'
                                            PRINCIPAL: '增值券'
                                            REBATE: '返现券'
                                        }[info.type]

                                        value = info.parValue
                                        value /= 100 if info.type is INTEREST

                                        unit = if info.type is INTEREST then '%' else '元'

                                        if item.id is null
                                            return "返现券"

                                        return "#{ value + unit + type_cn } - 最低投资额: #{ info.minimumInvest }" 
                                }
                            .value()

                    coupon_minimum: (item) =>
                        @$scope.store.amount >= item.minimum
                }

                do ({amount, coupon} = @$routeParams) =>

                    if coupon
                        @$scope.store.coupon = _.find @$scope.coupon_list, id: coupon

                    if +amount
                        @$scope.store.amount = +amount


            amount_polishing: (amount) ->

                loan = @$scope.loan
                rule = loan.raw.loanRequest.investRule

                [step, balance, maximum] = [rule.stepAmount, loan.balance, rule.maxAmount]

                amount = Math.max 0, amount
                amount = Math.min amount, balance
                amount = Math.min amount, maximum

                return amount // step * step


            fetch_analyse: (amount = 0, loan = @$scope.loan) ->

                data = {
                    amountValue: amount
                    dueDay: loan.raw.duration.days
                    dueMonth: loan.raw.duration.months
                    dueYear: loan.raw.duration.years
                    annualRate: loan.rate
                    paymentMethod: loan.method
                }

                @api.fetch_invest_analyse(data).success (response) =>
                    @$scope.earning = +response.data?.interest


            fetch_analyse1: (amount = 0, loan = @$scope.loan) ->

                if loan.raw.duration.days == 0
                    protimeT =  parseInt(loan.raw.duration.totalMonths)
                    rebateMoney = amount * protimeT / 12 * 0.005

                else
                    protimeT =  parseInt(loan.raw.duration.totalDays)
                    rebateMoney = amount * protimeT / 365*0.005
                #console.log  @$scope.abc
                if @coupon.data.length == 0
                    @$scope.abc = 0
                else
                    @$scope.abc = @coupon.data[0].actualAmount
                if rebateMoney >  @$scope.abc
                    rebateMoney = @$scope.abc

                @$scope.earning1 = rebateMoney.toFixed(2)

            detection: (amount = 0,max = @$scope.maxMoney,min = @$scope.minMoney, loan = @$scope.loan) ->

                if amount>max
                    @$scope.store.amount = parseInt(max)

                else if amount<min
                    @$scope.store.amount = parseInt(min)
                else
                    @$scope.store.amount = parseInt(amount)



            newCoupon_list: (id) ->

                @api.fetch_coupon_list_select(id)
            getAgreement_name: (id) ->

                @api.get_agreement_name(id)

                

            pick_up_coupon: (event, input_amount = 0) ->

                do event.preventDefault

                new_path = ARRAY_JOIN_SLASH.call [
                    'dashboard/coupon'
                    @$scope.loan.balance
                    @$scope.loan.raw.duration.totalMonths
                    @$scope.loan.id
                    input_amount
                ]

                @$location
                    .path new_path
                    .search back: ARRAY_JOIN_SLASH.call [@page_path_origin, input_amount]

            #changeSelect: (event, input_amount = 0) ->

                #alert "222"

                #@$scope.earning1 =   event

                #@$scope.earning1 =  @$scope.loan.balance


            submit: (event) ->
                do event.preventDefault  # submitting via AJAX
                if @$scope.lccbAuth==false
                    @paymentPoint()
                else
                    @invest()
                

            prompt_coupon_sharing: (id) ->

                prompt = @$uibModal.open {
                    size: 'sm'
                    keyboard: false
                    backdrop: 'static'
                    windowClass: 'center ngt-share-coupon'
                    animation: true
                    templateUrl: 'components/templates/ngt-share-coupon.tmpl.html'

                    controller: _.ai '$scope', ($scope) =>
                        angular.extend $scope, {id}
                }

                once = @$scope.$on '$locationChangeStart', ->
                    prompt?.dismiss()
                    do once

                return prompt.result


            prompt_short_of_balance: ->

                prompt = @$uibModal.open {
                    size: 'sm'
                    keyboard: false
                    backdrop: 'static'
                    windowClass: 'center'
                    animation: true
                    templateUrl: 'ngt-loan-invest-short-of-balance.tmpl'

                    controller: _.ai '$scope', ($scope) =>
                        angular.extend $scope, {
                            balance: @user.fund.availableAmount
                            minimum: @loan.loanRequest.investRule.minAmount
                        }
                }

                prompt.result.catch (new_path) =>

                    @$location
                        .path new_path
                        .search next: @page_path



            agreement: (name) ->

                api_path = '/api/v2/cms/category/DECLARATION/name/' + name

                @$uibModal.open {
                    size: 'lg'
                    backdrop: 'static'
                    windowClass: 'center ngt-invest-agreement'
                    animation: true
                    templateUrl: 'ngt-invest-agreement.tmpl'

                    resolve: {
                        content: _.ai '$http', ($http) ->
                            $http
                                .get api_path, {cache: true}
                                .then (response) -> _.get response.data, '[0].content'
                    }

                    controller: _.ai '$scope, content',
                        (             $scope, content) ->
                            angular.extend $scope, {content}
                }

            invest: (mobile_captcha) ->

                if @$scope.lccbAuth==false
                    if typeof mobile_captcha =="undefined" || mobile_captcha==null || !(/^\d{6}$/.test mobile_captcha)
                        @mg_alert "验证码不正确!"
                        return
                    if !@smsid
                        @mg_alert "请获取验证码后在操作!"
                        return
                    
                    return unless !!mobile_captcha and !!@smsid

                good_to_go = true
                loan = @$scope.loan

                {password} = @$scope.store
                coupon = @$scope.store?.coupon
                amount = @$scope.store.amount or 0
                loan_minimum = loan.raw.loanRequest.investRule.minAmount
                loan_maximum = loan.raw.loanRequest.investRule.maxAmount
                loan_available = loan.balance
                loan_step = loan.raw.loanRequest.investRule.stepAmount
                user_available = @user.fund.availableAmount
                coupon_minimum = @$scope.store.coupon?.minimum
                
                (if amount > loan_available
                    good_to_go = false
                    @mg_alert "当前剩余可投#{ loan_available }元"
                else if loan_available < loan_minimum
                    good_to_go = true

                else if amount < loan_minimum or (amount - loan_minimum) % loan_step isnt 0
                    good_to_go = false
                    @mg_alert "#{ loan_minimum }元起投，#{ loan_step }元递增"

                else if amount > loan_maximum and loan_maximum != 0
                    good_to_go = false
                    @mg_alert "单笔最多可投 #{ loan_maximum }元"

                else if user_available <= 0 or amount > user_available
                    good_to_go = false
                    do @prompt_short_of_balance

                else if coupon_minimum and amount < coupon_minimum
                    good_to_go = false
                    @mg_alert "该优惠券需要投资额大于 #{ coupon_minimum } 方可使用"
                )


                return unless good_to_go

                @submit_sending = true
                password = filterXSS(password)
                amount = filterXSS(amount.toString())
                
                if coupon != undefined and coupon.id == null

                    #console.log 123
                    (@api.payment_pool_rebeat loan.id, password, amount, @user.fund.userId, @$scope.earning1, @smsid, mobile_captcha

                        .then @api.process_response
                        .then @api.TAKE_RESPONSE_DATA

                        .then ({userShare, tenderResult}) =>
                            return true unless userShare?.id

                            @prompt_coupon_sharing(userShare.id).catch =>
                                @$q.resolve false

                        .then (alert_success) =>

                            if alert_success
                                @mg_alert '投标成功'
                                .result.finally =>
                                    @$location.path "/loan/#{ @loan.id }"

                            @$location.path "/loan/#{ @loan.id }"

                            @$scope.$on '$locationChangeSuccess', =>
                                @$window.location.reload()

                        .catch (data) =>
                            message = _.get data, 'error[0].message', '系统繁忙，请稍后重试！'
                            @mg_alert message

                        .finally =>
                            @smsid=null
                            @submit_sending = false
                    )

                else


                    (@api.payment_pool_tender(loan.id, password, amount, coupon?.id, @smsid, mobile_captcha)

                        .then @api.process_response
                        .then @api.TAKE_RESPONSE_DATA

                        .then ({userShare, tenderResult}) =>
                            return true unless userShare?.id

                            @prompt_coupon_sharing(userShare.id).catch =>
                                @$q.resolve false

                        .then (alert_success) =>

                            if alert_success
                                @mg_alert '投标成功'
                                    .result.finally =>
                                        @$location.path "/loan/#{ @loan.id }"

                            @$location.path "/loan/#{ @loan.id }"

                            @$scope.$on '$locationChangeSuccess', =>
                                @$window.location.reload()

                        .catch (data) =>
                            message = _.get data, 'error[0].message', '系统繁忙，请稍后重试！'
                            @mg_alert message

                        .finally =>
                            @smsid=null
                            @submit_sending = false
                    )
                    
                

            paymentPoint:()->
                payment=@$uibModal.open {
                    size: 'sm'
                    keyboard: false
                    backdrop: 'static'
                    windowClass: 'center ngt-share-coupon'
                    animation: true
                    templateUrl: 'ngt-pool-recharge.tmpl'

                    controller: _.ai '$scope', ($scope) =>
                        self=@
                        angular.extend $scope, {
                          bankNumber:@user.bank_account.bankMobile.substring(0,3)+"****"+@user.bank_account.bankMobile.substring(7),
                          mobile_verification_code_has_sent:true,
                          cell_buffering : false,
                          cell_buffering_count : 120.119,
                          get_verification_code: () ->
                            $scope.mobile_verification_code_has_sent = true
                            if self.timer
                                self.$interval.cancel self.timer
                                self.timer=null
                                $scope.cell_buffering_count =120.119
                                $scope.cell_buffering = false
                            if !self.user.bank_account||!self.user.bank_account.bankMobile
                                self.mg_alert '您需要开通银行存管才可操作！'
                                self.$location
                                    .replace()
                                    .path "dashboard/payment/register"
                                return
                            else
                                phonenumber=filterXSS self.user.bank_account.bankMobile

                            if !self.user.bank_account||!self.user.bank_account.account || !self.user.bank_account.name
                                self.mg_alert '您需要开通银行存管才可操作！'
                                self.$location
                                    .replace()
                                    .path "dashboard/payment/register"
                                return
                            else
                                cardnbr=filterXSS self.user.bank_account.account
                                username=filterXSS  self.user.bank_account.name


                            return unless !!phonenumber and !!cardnbr and !!self.user.bank_account and !!username

                            transtype='800004'

                            (self.api.payment_pool_send_captcha(self.user.info.id,transtype,phonenumber,cardnbr,username)

                                .then (data) =>
                                    $scope.cell_buffering=false
                                    return self.$q.reject(data) unless data.status is 0
                                    return data

                                .then (data) =>
                                    console.log "$scope.cell_buffering_count:",$scope.cell_buffering_count
                                    self.smsid=data.data
                                    self.timer = self.$interval =>
                                      $scope.cell_buffering_count -= 1

                                      if $scope.cell_buffering_count < 1
                                          @$interval.cancel self.timer
                                          self.timer=null
                                          $scope.cell_buffering_count += 1000 * ($scope.cell_buffering_count % 1)
                                          $scope.cell_buffering = false
                                    , 1000

                                    $scope.cell_buffering = true
                                    
                                    $scope.mobile_verification_code_has_sent = false
                                .catch (data) =>

                                  key = _.get data, 'msg'
                                  self.mg_alert "短信发送失败,"+key

                                  $scope.mobile_verification_code_has_sent = false
                            )
                        }
                        $scope.cell_buffering=true
                        do $scope.get_verification_code
                        
                }
                payment.result.catch (mobile_captcha) =>
                
                    @invest(mobile_captcha)

                  







    ARRAY_JOIN_SLASH = _.partialRight Array::join, '/'
