
do (_, angular) ->

    angular.module('controller').controller 'LoginCtrl',

        _.ai '            @api, @$scope, @$rootScope, @$window, @$timeout, @$location, @$routeParams, @$q, @$http', class
            constructor: (@api, @$scope, @$rootScope, @$window, @$timeout, @$location, @$routeParams, @$q, @$http) ->

                @next_path = @$routeParams.next
                @page_path = @$location.path()

                @submit_sending = false
                @flashing_error_message = false

                do @get_banner


            error_message_flash: ->
                @flashing_error_message = true
                @$timeout.cancel @timer

                @timer = @$timeout (=>
                    @flashing_error_message = false
                ), 2000


            get_banner: ->

                @$http.get '/api/v2/cms/category/IMAGE/name/%E6%B3%A8%E5%86%8C', cache: true
                    .then (response) =>
                        @$scope.banner = src: _.get response, 'data[0].content'


            goto: (new_path) ->

                @$location.path new_path


            login: ({username, password}) ->

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
