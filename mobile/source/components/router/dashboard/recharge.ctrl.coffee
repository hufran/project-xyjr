
do (angular) ->

    angular.module('controller').controller 'RechargeCtrl',

        _.ai '            @user, @api, @cookie2root, @$location, @$scope, @$window, @$routeParams', class
            constructor: (@user, @api, @cookie2root, @$location, @$scope, @$window, @$routeParams) ->

                @$window.scrollTo 0, 0

                @next_path = @$routeParams.next

                @$scope.bank_account = @user.bank_account

                angular.extend @$scope, {
                    available_amount: @user.fund.availableAmount
                    total_amount: @user.fund.availableAmount + @user.fund.frozenAmount
                    bank_account: @user.bank_account
                }


            open_payment_account: ($event) ->

                @cookie2root 'return_url', 'dashboard/recharge'


            submit: (amount) ->

                @cookie2root 'return_url', 'dashboard/funds'

                return

                (@api.payment_ump_non_password_recharge(amount)

                    .then (data) =>
                        unless data.success is true
                            @$q.reject data

                    .then (data) =>
                        @$window.alert @$scope.msg.success

                        if @next_path
                            @$location
                                .path @next_path
                                .search 'next', null
                        else
                            @$location.path '/dashboard/funds'

                        @$window.location.reload()

                    .catch (data) =>
                        message = _.get data, 'error[0].message'

                        if message
                            @$window.alert message
                            @$location.path '/dashboard'
                        else
                            # something wrong on server side

                    .finally =>
                        @submit_sending = false
                )
