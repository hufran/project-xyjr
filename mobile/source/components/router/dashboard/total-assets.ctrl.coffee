
do (_, angular) ->

    angular.module('controller').controller 'TotalAssetsCtrl',

        _.ai '            @api, @user, @$scope, @$window, map_funds_summary', class
            constructor: (@api, @user, @$scope, @$window, map_funds_summary) ->

                @$window.scrollTo 0, 0

                due = @user.fund.dueInAmount
                frozen = @user.fund.frozenAmount
                available = @user.fund.availableAmount

                total = _.sum [due, frozen, available]

                outstanding_principal = @user.fund.outstandingPrincipal
                outstanding_interest = @user.fund.outstandingInterest
                invest_frozen = @user.fund.investFrozenAmount
                withdraw_frozen = frozen - invest_frozen

                @$scope.fund = {
                    available
                    total

                    outstanding_principal
                    outstanding_interest
                    invest_frozen
                    withdraw_frozen
                    frozen
                }

                @$scope.loading = true

                @api.get_user_funds()

                    .then (data) =>
                        @$scope.list = data.results.map map_funds_summary

                    .finally =>
                        @$scope.loading = false


