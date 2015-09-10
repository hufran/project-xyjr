
do (_, angular, Math) ->

    angular.module('controller').controller 'LoanInvestCtrl',

        _.ai '            @api, @user, @loan, @coupon, @cookie2root, @$scope, @$q, @$location, @$window, map_loan_summary, @$modal', class
            constructor: (@api, @user, @loan, @coupon, @cookie2root, @$scope, @$q, @$location, @$window, map_loan_summary, @$modal) ->

                @$window.scrollTo 0, 0

                @page_path = @$location.path()[1..]

                angular.extend @$scope, {
                    store: {}
                    earning: 0
                    loan: map_loan_summary @loan

                    coupon_list:
                        _(@coupon.data)
                            .filter (item) -> item.disabled is false
                            .pluck 'placement'
                            .filter (item) -> item.couponPackage.type isnt 'CASH'
                            .map (item) ->
                                info = item.couponPackage

                                return {
                                    id: item.id
                                    minimum: info.minimumInvest

                                    display: do ->
                                        INTEREST = 'INTEREST'

                                        type_cn = {
                                            CASH: '现金红包'
                                            INTEREST: '加息券'
                                            PRINCIPAL: '增值券'
                                            REBATE: '投资红包'
                                        }[info.type]

                                        value = info.parValue
                                        value /= 100 if info.type is INTEREST

                                        unit = if info.type is INTEREST then '%' else '元'

                                        return "#{ value + unit + type_cn } - 最低投资额: #{ info.minimumInvest }"
                                }
                            .value()

                    coupon_minimum: (item) =>
                        @$scope.store.amount >= item.minimum
                }


            open_payment_account: ($event) ->

                @cookie2root 'return_url', @page_path


            amount_polishing: (amount) ->

                step = @$scope.loan.raw.loanRequest.investRule.stepAmount
                amount = Math.max 0, amount

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


            submit: (event) ->

                good_to_go = true

                amount = @$scope.store.amount or 0
                loan_minimum = @loan.loanRequest.investRule.minAmount
                loan_step = @loan.loanRequest.investRule.stepAmount
                loan_available = @loan.balance
                user_available = @user.fund.availableAmount
                coupon_minimum = @$scope.store.coupon?.minimum

                (if user_available <= 0 or amount > user_available
                    good_to_go = false
                    # do @prompt_short_of_balance
                    @alert '余额不足，请前去充值'

                else if amount < loan_minimum or (amount - loan_minimum) % loan_step isnt 0
                    good_to_go = false
                    @alert "#{ loan_minimum }元起投，#{ loan_step }元递增"

                else if amount > loan_available
                    good_to_go = false
                    @alert "当前可投 #{ loan_available }元"

                else if coupon_minimum and amount < coupon_minimum
                    good_to_go = false
                    @alert "该优惠券需要投资额大于 #{ coupon_minimum } 方可使用"
                )

                return unless good_to_go

                (@api.payment_pool_tender(@loan.id, @$scope.password, amount, @$scope.store.coupon?.id)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (data) =>
                        @$window.alert '投标成功'

                        @$location.path "/loan/#{ @loan.id }"

                        @$scope.$on '$locationChangeSuccess', =>
                            @$window.location.reload()

                    .catch (data) =>
                        message = _.get data, 'error[0].message', 'something happened...'
                        @$window.alert message

                    .finally =>
                        # pass
                )


                return # skip out code down from here


                if amount > user_available
                    good_to_go = false
                    recharge_amount = (amount - user_available + 0.5) | 0

                    if @$window.confirm "余额不足，前去充值 #{ recharge_amount }元？"

                        @$location
                            .path "/dashboard/recharge/#{ recharge_amount }"
                            .search auto: true, disabled: true

                if coupon_minimum and amount < coupon_minimum
                    @$window.alert "该优惠券需要投资额大于 #{ coupon_minimum } 方可使用"
                    good_to_go = false

                unless good_to_go
                    return event.preventDefault()


            prompt_short_of_balance: ->

                prompt = @$modal.open {
                    size: 'sm'
                    keyboard: false
                    backdrop: 'static'
                    windowClass: 'center modal-confirm'
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


            alert: (content) ->

                @$modal.open {
                    size: 'sm'
                    keyboard: false
                    backdrop: 'static'
                    windowClass: 'center modal-confirm'
                    animation: true
                    templateUrl: 'ngt-loan-invest-alert.tmpl'

                    controller: _.ai '$scope', ($scope) =>
                        angular.extend $scope, {
                            content: content
                        }
                }


            agreement: ->

                api_path = '' # To do: add api_path url

                @$modal.open {
                    size: 'lg'
                    backdrop: 'static'
                    windowClass: 'center'
                    animation: true
                    templateUrl: 'ngt-invest-agreement.tmpl'

                    resolve: {
                        content: _.ai '$http', ($http) ->
                            $http
                                .get encodeURI(api_path), {cache: true}
                                .then (response) -> _.get response.data, '[0].content'
                    }

                    controller: _.ai '$scope, content',
                        (             $scope, content) ->
                            angular.extend $scope, {content}
                }


