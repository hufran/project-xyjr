
do (_, angular) ->

    angular.module('controller').controller 'LoginCtrl',

        _.ai '            @api, @$scope, @$rootScope, @$window, @$timeout, @$location, @$routeParams, @$q', class
            constructor: (@api, @$scope, @$rootScope, @$window, @$timeout, @$location, @$routeParams, @$q) ->

                @next_path = @$routeParams.next
                @page_path = @$location.path()

                @submit_sending = false
                @flashing_error_message = false


            error_message_flash: ->
                @flashing_error_message = true
                @$timeout.cancel @timer

                @timer = @$timeout (=>
                    @flashing_error_message = false
                ), 2000


            login: (store = {}) ->
                {username, password} = store

                unless username and password
                    return do @error_message_flash

                @submit_sending = true
                @flashing_error_message = false


                (@api.login(username, password)

                    .then (data) =>
                        return @$q.reject(data) unless data?.success is true
                        return data

                    .then (data, {bind_social_weixin} = @$routeParams) =>
                        if bind_social_weixin
                            @api.bind_social 'WEIXIN', bind_social_weixin

                        return data

                    .then (data) =>
                        @api.fetch_current_user().then =>
                            return unless @page_path is @$location.path()

                            unless @next_path
                                @$location.path '/'
                            else
                                @$location
                                    .path @next_path
                                    .search 'next', null

                    .catch (data) =>
                        result = _.get data, 'error_description.result'

                        if result in _.split 'TOO_MANY_ATTEMPT USER_DISABLED'
                            @$window.alert @$scope.msg.DISABLED
                        else
                            do @error_message_flash

                        @submit_sending = false
                )
