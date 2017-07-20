
do (angular) ->

    angular.module('controller').controller 'WithdrawCtrl',

        _.ai '            @user, @api, @$location, @$scope, @$window, @$q, @mg_alert', class
            constructor: (@user, @api, @$location, @$scope, @$window, @$q, @mg_alert) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    bank_account: _.clone @user.bank_account
                    available_amount: @user.fund.availableAmount
                    total_amount: @user.fund.availableAmount + @user.fund.frozenAmount
                }

                @submit_sending = false

                @api.get_available_bank_list().then (data) =>
                    data["CIB"]="兴业银行";
                    data["CMBC"]="中国民生银行";
                    data["ABC"]="中国农业银行";
                    @$scope.bank_account.bank = data[@$scope.bank_account.bank]


            submit: (amount = @$scope.amount or 0, password) ->
                amount = filterXSS(amount.toString())
                password = filterXSS(password)
                @submit_sending = true

                (@api.payment_pool_check_password(password)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .catch (data) =>
                        @$q.reject error: [message: 'INCORRECT_PASSWORD']


                    .then (data) => @api.payment_pool_withdraw(amount, password)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (data) =>
                        @mg_alert @$scope.msg.SUCCEED
                            .result.finally =>
                                @$location.path 'dashboard'

                        @$scope.$on '$locationChangeStart', (event, new_path) =>
                            event.preventDefault()
                            @$window.location = new_path

                    .catch (data) =>
                        @submit_sending = false
                        key = _.get data, 'error[0].message'
                        @mg_alert @$scope.msg[key] or key

                    .finally =>
                        42
                )
