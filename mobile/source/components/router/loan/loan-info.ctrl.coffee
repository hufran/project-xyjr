
do (_ ,angular) ->

    angular.module('controller').controller 'LoanInfoCtrl',

        _.ai '            @$scope, @$rootScope, @$window, @$routeParams, @$location', class
            constructor: (@$scope, @$rootScope, @$window, @$routeParams, @$location) ->

                id = @$routeParams.id
                loan = @$rootScope.loan_and_investors_cache?[id]?.loan

                unless loan
                    @$location.path "loan/#{ id }"

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    id: id
                    loan: loan
                }
