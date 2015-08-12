
do (angular) ->

    angular.module('controller').controller 'LoanInvestReturnCtrl',

        _.ai '            @$scope, @$cookies, @$routeParams', class
            constructor: (@$scope, @$cookies, @$routeParams) ->

                angular.extend @$scope, {
                    id: @$routeParams.id
                    result: @$routeParams.result
                    action: @$routeParams.action
                }
