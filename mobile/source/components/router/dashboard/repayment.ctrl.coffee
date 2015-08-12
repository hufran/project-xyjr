
do (angular) ->

    angular.module('controller').controller 'RepaymentCtrl',

        _.ai '            @data, @$scope, @$rootScope, @$window', class
            constructor: (@data, @$scope, @$rootScope, @$window) ->

                @$window.scrollTo 0, 0

                @$scope.data = @data.map (item) ->
                    repayment = item.repayment.repayment # wtf
                    dates = repayment.dueDate.values

                    return {
                        status: item.repayment.status
                        amount: repayment.amount

                        date: do ([y, m, d] = dates) -> [y, m - 1, d]

                        type: do ({amountInterest, amountPrincipal} = repayment) -> switch

                            when amountInterest > 0 and amountPrincipal > 0
                                'both'
                            when amountInterest > 0
                                'interest'
                            when amountPrincipal > 0
                                'principal'
                    }
