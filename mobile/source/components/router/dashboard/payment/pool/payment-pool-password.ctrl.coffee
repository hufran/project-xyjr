
do (_, angular) ->

    angular.module('controller').controller 'PaymentPoolPasswordCtrl',

        _.ai '            @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams', class
            constructor: (@user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams) ->

                @$window.scrollTo 0, 0

                @next_path = @$routeParams.next or 'dashboard'

                @submit_sending = false


            set_password: (password) ->

                @submit_sending = true

                (@api.payment_pool_set_password(password)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (data) =>
                        @user.has_payment_password = true
                        @$location.path @next_path

                    .catch (data) =>
                        @submit_sending = false
                        @$window.alert _.get data, 'error[0].message', 'something happened...'
                )
