
do (angular) ->

    custom = '
        filter
        factory
        service
        provider
        directive
        controller

    '.split ' '

    for name in custom
        angular.module name, []

    @modules = custom.concat '
        ngRoute
        ngCookies
        ngResource
        ngSanitize
        ngMessages
        ngAnimate

        ui.validate
        ui.bootstrap

        timer
        easypiechart

    '.split ' '
