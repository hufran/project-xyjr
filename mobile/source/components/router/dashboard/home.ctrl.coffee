
do (angular) ->

    angular.module('controller').controller 'DashboardCtrl',

        _.ai '            @api, @user, @$scope, @$rootScope, @$window, @$location', class
            constructor: (@api, @user, @$scope, @$rootScope, @$window, @$location) ->

                @$window.scrollTo 0, 0

                @$scope.fund = {
                    invest_interest: @user.fund.investInterestAmount
                    current_yield: @user.fund.currentYield

                    due: @user.fund.investingInterestAmount
                    frozen: @user.fund.frozenAmount
                    available: @user.fund.availableAmount

                    total: @user.fund.investingPrincipalAmount
                }

                # prefetch following API calls for getting out from cache directly later on

                @api.get_user_funds()
                @api.get_user_investments()


            logout: ->
                @api.logout().then =>
                    @$location.path '/'
                    @$window.location.reload()
