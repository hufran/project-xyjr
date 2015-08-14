
do (_ ,angular) ->

    angular.module('controller').controller 'LoanInvestorsCtrl',

        _.ai '            @$scope, @$rootScope, @$window, @$routeParams, @$location', class
            constructor: (@$scope, @$rootScope, @$window, @$routeParams, @$location) ->

                id = @$routeParams.id
                investors = @$rootScope.loan_and_investors_cache?[id]?.investors

                unless _.isArray investors
                    @$location.path "loan/#{ id }"

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    id: id
                    investors: investors
                }
