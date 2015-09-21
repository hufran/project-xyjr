
do (angular) ->

    angular.module('controller').controller 'WithdrawCtrl',

        _.ai '            @user, @api, @cookie2root, @$location, @$scope, @$window, @$q, @$modal', class
            constructor: (@user, @api, @cookie2root, @$location, @$scope, @$window, @$q, @$modal) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    available_amount: @user.fund.availableAmount
                    total_amount: @user.fund.availableAmount + @user.fund.frozenAmount

                    bank_list: do (list = @user.bank_account_list) =>
                        return _.filter list, 'expressAccount' if @user.has_bank_card_express
                        return list
                }


            submit: (amount = @$scope.amount or 0, password) ->

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
                        @$window.alert @$scope.msg.SUCCEED
                        @$window.location.reload()

                    .catch (data) =>
                        key = _.get data, 'error[0].message'
                        @$window.alert @$scope.msg[key] or key

                    .finally =>
                        42
                )
