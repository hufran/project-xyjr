
do (_, angular) ->

    angular.module('controller').controller 'PasswordCtrl',

        _.ai '            @api, @$scope, @$location, @$window, @$q', class
            constructor: (@api, @$scope, @$location, @$window, @$q) ->

                @new_password_sending = false

                @$scope.store = {}


            fetch_new_captcha: ->

                @api.fetch_password_captcha().then (data) =>
                    @captcha = data
                    @$scope.store.captcha = ''


            send_password_reset: (store) ->

                @new_password_sending = true

                {login_name, mobile, captcha} = store

                (@api.reset_password(login_name, mobile, captcha, @captcha.token)

                    .then (data) =>
                        return @$q.reject data unless data.success is true
                        return data

                    .then (data) =>
                        @$window.alert @$scope.msg.success
                        @$location.path '/dashboard'
                        @$window.location.reload()

                    .catch (data) =>
                        error = _.get data, 'error[0].message', 'UNKNOWN'
                        error = _.result @$scope.msg, error
                        @$window.alert error

                    .finally =>
                        @new_password_sending = false
                )
