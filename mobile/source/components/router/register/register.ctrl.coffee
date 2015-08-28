
do (_, angular) ->

    angular.module('controller').controller 'RegisterCtrl',

        _.ai '            @api, @$scope, @$interval, @$location, @$routeParams, @$window, @$cookies, @$q, @$modal', class
            constructor: (@api, @$scope, @$interval, @$location, @$routeParams, @$window, @$cookies, @$q, @$modal) ->

                @$scope.store =
                    referral: @$routeParams.ref or @$routeParams.rel or @$routeParams.referral

                @cell_buffering = false
                @cell_buffering_count = 59.59

                @submit_sending = false
                @new_date = Date.now()


            get_verification_code: ({mobile, captcha}) ->

                @mobile_verification_code_has_sent = true

                (@api.send_verification_code(mobile, captcha, @captcha.token)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (data) =>

                        timer = @$interval =>
                            @cell_buffering_count -= 1

                            if @cell_buffering_count < 1
                                @$interval.cancel timer
                                @cell_buffering_count += 100 * (@cell_buffering_count % 1)
                                @cell_buffering = false
                                @fetch_new_captcha false
                        , 1000

                        @cell_buffering = true

                    .catch (data) =>
                        key = _.get data, 'error[0].message'
                        @$window.alert @$scope.msg[key] or @$scope.msg.UNKNOWN

                        do @fetch_new_captcha
                        @mobile_verification_code_has_sent = false
                )


            fetch_new_captcha: (reset = true) ->

                @api.fetch_register_captcha().then (data) =>
                    @captcha = data
                    @$scope.store.captcha = '' if reset


            signup: ({loginName, password, mobile, mobile_captcha, referral}) ->

                @submit_sending = true

                (@api.register(password, mobile, mobile_captcha)

                    .then (data) =>
                        unless data.success is true
                            @$q.reject data.error

                    .then (data) =>
                        @$window.alert @$scope.msg.SUCCEED
                        @$location.path '/dashboard'

                    .catch (data) =>
                        key = _.get data, '[0].message'
                        @$window.alert @$scope.msg[key]
                        @submit_sending = false
                )


            agreement: ->

                @$modal.open {
                    size: 'lg'
                    backdrop: 'static'
                    animation: true
                    templateUrl: 'ngt-register-agreement.tmpl'

                    resolve: {
                        content: _.ai '$http', ($http) ->
                            $http
                                .get '/api/v2/cms/category/DECLARATION/name/agreement'
                                .then (response) -> _.get response.data, '[0].content'
                    }

                    controller: _.ai '$scope, content',
                        (             $scope, content) ->
                            angular.extend $scope, {content}
                }
