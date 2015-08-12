
do (_, angular) ->

    angular.module('controller').controller 'InvestDetailCtrl',

        _.ai '            @api, @$scope, @$rootScope, @$window, @$routeParams', class
            constructor: (@api, @$scope, @$rootScope, @$window, @$routeParams) ->

                @$window.scrollTo 0, 0

                item = @$scope.item = do (list = @$rootScope.invest_list) =>
                    _.find list, (item) => @$routeParams.id is item.loan.id
                
                if item.status in _.split 'SETTLED CLEARED OVERDUE BREACH'
                    @api.get_invest_contract(item.id).then (url) =>
                        @$scope.contract_url = url
