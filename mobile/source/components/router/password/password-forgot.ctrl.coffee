
do (_, angular) ->

    angular.module('controller').controller 'PasswordForgotCtrl',

        _.ai '            @api, @$scope, @$location, @$window, @$routeParams, @$interval, @mg_alert, @$q', class
            constructor: (@api, @$scope, @$location, @$window, @$routeParams, @$interval, @mg_alert, @$q) ->

                @captcha = {timer: null, count: 60, count_default: 60, has_sent: false, buffering: false}

                @$scope.store = {}
                @$scope.sourceId = @$routeParams.sourceId


            fetch_new_captcha: ->

                @api.fetch_password_captcha().then (data) =>
                    @captcha = data
                    @$scope.store.captcha = ''


            send_mobile_captcha: (mobile) ->

                (@api.check_mobile(mobile)

                    .then (data) =>
                        return @$q.reject(data) if data.success is true
                        return data

                    .catch (data) =>
                        @$q.reject error: [message: 'MOBILE_NOT_EXISTS']

                    .then => @api.send_captcha_for_reset_password(mobile)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then =>
                        @captcha.timer = @$interval =>
                            @captcha.count -= 1

                            if @captcha.count < 1
                                @$interval.cancel @captcha.timer
                                @captcha.count = @captcha.count_default
                                @captcha.buffering = false
                        , 1000

                        @captcha.has_sent = @captcha.buffering = true

                    .catch (data) =>
                        error = _.get data, 'error[0].message', 'UNKNOWN'
                        error = _.result @$scope.msg, error
                        @mg_alert error
                )


            send_password_reset: ({mobile, captcha, password}) ->

                mobile = filterXSS(mobile)

                captcha = filterXSS(captcha)

                password = filterXSS(password)

                @new_password_sending = true

                (@api.reset_password(mobile, captcha, password)

                    .then (data) =>
                        return @$q.reject data unless data.success is true
                        return data

                    .then (data) =>

                        if  @$scope.sourceId != undefined
                            window.location.href = wxChatUrl+"/lend/loginA"
                        else
                            @mg_alert @$scope.msg.SUCCEED
                                .result.finally =>
                                    @$location.path '/login'

                            @$scope.$on '$locationChangeSuccess', =>
                                @$window.location.reload()

                    .catch (data) =>
                        error = _.get data, 'error[0].message', 'UNKNOWN'
                        error = _.result @$scope.msg, error
                        @mg_alert error

                    .finally =>
                        @new_password_sending = false
                )
