
do (_, angular) ->

    angular.module('controller').controller 'PaymentPoolRegisterCtrl',

        _.ai '            @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams', class
            constructor: (@user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams) ->

                @$window.scrollTo 0, 0

                @back_path = @$routeParams.back
                @next_path = @$routeParams.next or 'dashboard'

                @submit_sending = false

                @error = {timer: null, timeout: 2000, message: '', on: false}


            open_payment_account: (user_name, id_number) ->

                return unless !!user_name and !!id_number

                @submit_sending = true

                (@api.payment_pool_register(user_name, id_number)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (data) =>
                        @user.authenticates.idauthenticated = true
                        @$location.path @next_path

                    .catch (data) =>
                        @submit_sending = false

                        @$timeout.cancel @error.timer

                        @error.message  = _.get data, 'error[0].message'
                        @error.message ?= 'something happened...'

                        @error.on = true

                        @error.timer = @$timeout =>
                            @error.on = false
                        , @error.timeout
                )