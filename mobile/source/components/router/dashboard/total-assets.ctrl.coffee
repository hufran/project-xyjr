
do (_, angular) ->

    angular.module('controller').controller 'TotalAssetsCtrl',

        _.ai '            @user, @$scope, @$window', class
            constructor: (@user, @$scope, @$window) ->

                @$window.scrollTo 0, 0

                due = @user.fund.dueInAmount
                frozen = @user.fund.frozenAmount
                available = @user.fund.availableAmount

                total = _.fixed_in_2 _.sum [due, frozen, available]

                outstanding_principal = @user.fund.outstandingPrincipal
                outstanding_interest = @user.fund.outstandingInterest
                invest_frozen = @user.fund.investFrozenAmount
                withdraw_frozen = _.fixed_in_2 frozen - invest_frozen

                @$scope.fund = {
                    available
                    total

                    outstanding_principal
                    outstanding_interest
                    invest_frozen
                    withdraw_frozen
                }
