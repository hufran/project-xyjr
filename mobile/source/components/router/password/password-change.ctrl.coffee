
do (_, angular) ->

    angular.module('controller').controller 'PasswordChangeCtrl',

        _.ai '            @user, @api, @$scope, @$location, @$window, @$interval, @mg_alert, @$q', class
            constructor: (@user, @api, @$scope, @$location, @$window, @$interval, @mg_alert, @$q) ->

                @$scope.store = {
                    mobile: @user.info.mobile
                }


            send_password_reset: ({mobile, password_old, password}) ->

                password_old = filterXSS(password_old)

                password = filterXSS(password)

                @new_password_sending = true

                (@api.change_password(mobile, password_old, password)

                    .then (data) =>
                        return @$q.reject data unless data.success is true
                        return data

                    .then (data) =>
                        @mg_alert @$scope.msg.SUCCEED
                            .result

                    .then => @api.login(mobile, password)

                    .then =>
                        @$location.path 'dashboard'

                    .catch (data) =>
                        error = _.get data, 'error[0].message'
                        @mg_alert error

                    .finally =>
                        @new_password_sending = false
                )
