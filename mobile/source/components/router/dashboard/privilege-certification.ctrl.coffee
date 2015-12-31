

do (angular) ->

    angular.module('controller').controller 'privilegeCertificationCtrl',

        _.ai ' @user, @api, @$scope, @$window, @$q, @mg_alert, @$location, @$routeParams', class
            constructor: (@user, @api, @$scope, @$window, @$q, @mg_alert, @$location, @$routeParams) ->

                @$window.scrollTo 0, 0

                @api.chec_gm_innerUserCode()
                    .then (data) =>
                        return @$q.reject(data) if data.innerUserAuthenticated is true
                        return data

                    .catch =>
                        @mg_alert '已认证，去投资'
                            .result.finally =>
                                @$location.path 'list'

                @back_path = @$routeParams.back or 'dashboard/settings'

                @submit_sending = false

            send_gm_code: (inner_user_code) ->

                return unless !!inner_user_code

                @submit_sending = true

                (@api.privilege_gm_innerUserCode(inner_user_code)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (data) =>
                        @mg_alert '认证成功'
                            .result.finally =>
                                @$location.path 'list'

                    .catch (data) =>
                        @submit_sending = false

                        error = _.get data, 'error[0].message', '系统繁忙，请稍后重试！'
                        @mg_alert error

                )