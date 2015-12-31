
do (_, angular) ->

    angular.module('controller').controller 'LYGWrapperCtrl',

        _.ai '            @user, @api, @$location, @$scope, @$window, @$q, @$uibModal, @map_loan_summary', class
            constructor: (@user, @api, @$location, @$scope, @$window, @$q, @$uibModal, @map_loan_summary) ->

                42









    angular.module('directive').directive 'lygDirective', ->

        restrict: 'AE'
        replace: true
        transclude: true
        controller: 'LYGCtrl as self'
        templateUrl: 'components/router/lyg/lyg.tmpl.html'
