
do (angular) ->

    angular.module('directive').directive 'gyroHeader', ->

        restrict: 'AE'
        replace: true
        transclude: true
        templateUrl: 'components/header/header.tmpl.html'

        scope: {}

        controller: _.ai '@$element, @$location, @$rootScope', class
            constructor: (@$element, @$location, @$rootScope) ->
                42

        controllerAs: 'self'









    angular.module('directive').directive 'headerDropdownMenu', ->

        restrict: 'AE'
        replace: true
        transclude: true
        templateUrl: 'components/templates/ngt-header-dropdown-menu.tmpl.html'

        scope: {}

        controller: _.ai '@user', class
            constructor: (@user) ->
                42

        controllerAs: 'self'
