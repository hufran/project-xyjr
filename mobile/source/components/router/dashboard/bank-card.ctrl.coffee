
do (_, angular) ->

    angular.module('controller').controller 'BankCardCtrl',

        _.ai '            @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams', class
            constructor: (@user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams) ->

                @$window.scrollTo 0, 0

                @$scope.bank_account = @user.bank_account


            unbind: (account, password) ->

                (@api.payment_pool_unbind_card(account, password)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (response) =>
                        @$window.location.reload()

                    .catch (response) =>
                        @$window.alert _.get response, 'error[0].message', 'something happened...'
                )
