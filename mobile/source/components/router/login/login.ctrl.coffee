
do (angular) ->

    angular.module('controller').controller 'LoginCtrl',

        _.ai '            @api, @$scope, @$rootScope, @$timeout, @$location, @$routeParams', class
            constructor: (@api, @$scope, @$rootScope, @$timeout, @$location, @$routeParams) ->

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


                @api.login(username, password).success (data) =>
                    unless data?.success is true
                        do @error_message_flash
                        @submit_sending = false
                        return

                    @api.fetch_current_user().then =>
                        return unless @page_path is @$location.path()

                        unless @next_path
                            @$location.path '/dashboard'
                        else
                            @$location.path @next_path
                                .search 'next', null
