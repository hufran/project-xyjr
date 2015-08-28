
do (angular) ->

    angular.module('controller').controller 'RechargeCtrl',

        _.ai '            @user, @api, @baseURI, @$location, @$scope, @$window, @$routeParams', class
            constructor: (@user, @api, @baseURI, @$location, @$scope, @$window, @$routeParams) ->

                @$window.scrollTo 0, 0

                @next_path = @$routeParams.next

                @$scope.bank_account = @user.bank_account

                angular.extend @$scope, {
                    available_amount: @user.fund.availableAmount
                    total_amount: @user.fund.availableAmount + @user.fund.frozenAmount
                    bank_account: @user.bank_account
                    return_url: @baseURI + 'dashboard/funds'
                }

            submit: (amount) ->
                return

                @cookie2root 'return_url', 'dashboard/funds'


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
