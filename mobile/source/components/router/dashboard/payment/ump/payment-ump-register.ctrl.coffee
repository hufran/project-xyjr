
do (_, angular) ->

    angular.module('controller').controller 'PaymentUmpRegisterCtrl',

        _.ai '            @user, @api, @$scope, @$window, @$q, @$location', class
            constructor: (@user, @api, @$scope, @$window, @$q, @$location) ->

                @$window.scrollTo 0, 0

                @submit_sending = false


            submit: (fullname, id_number) ->

                @submit_sending = true

                (@api.payment_ump_register(fullname, id_number)

                    .then (data) =>
                        unless data.success is true
                            @$q.reject data

                    .then (data) =>
                        @$window.alert @$scope.msg.success
                        @$location.path '/dashboard/payment/agreement'

                    .catch (data) =>
                        message  = _.get data, 'data.retMsg'       # ID and name not match up
                        message ?= _.get data, 'error[0].message'  # ID has already been used

                        if message
                            @$window.alert message
                        else
                            # something wrong on server side

                    .finally =>
                        @submit_sending = false
                )
