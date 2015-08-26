
do (_, angular) ->

    angular.module('controller').controller 'InvestCtrl',

        _.ai '            @data, @$scope, @$rootScope, @$window, map_loan_summary', class
            constructor: (@data, @$scope, @$rootScope, @$window, map_loan_summary) ->

                @$window.scrollTo 0, 0

                (list = @data.map (item) ->

                    repayment = do ({repayments} = item, {filter, sum, status} = {}) ->
                        return {} if _.isEmpty repayments

                        filter = _.partial _.filter, repayments
                        sum = (item, key = 'amount') -> _.fixed_in_2(_.sum item, (item) -> item.repayment[key])
                        status = (item) -> item.status is 'REPAYED'

                        return {
                            repayed:     sum filter status
                            interest:    sum repayments, 'amountInterest'
                            outstanding: sum filter _.negate status
                        }

                    return {
                        id: item.id
                        loan: map_loan_summary item.loan
                        rate: _.fixed_in_2 item.rate / 100
                        title: item.loanTitle
                        status: item.status
                        percent: (item.investPercent * 100) | 0

                        amount: item.amount
                        amount_repayed: repayment.repayed or 0
                        amount_interest: repayment.interest or 0
                        amount_outstanding: repayment.outstanding or 0

                        total_days: item.duration.totalDays
                        total_months: item.duration.totalMonths

                        end_date: item.endDate
                        submit_time: item.submitTime
                    }
                )

                (@$scope.list = @$rootScope.invest_list = do (list, {filter} = {}) ->

                    filter = (status_list) ->
                        _.filter list, (item) -> _.includes status_list, item.status

                    return filter _.split 'FROZEN FINISHED SETTLED CLEARED OVERDUE BREACH'
                )









    angular.module('directive').directive 'investSummary', ->

        restrict: 'AE'
        templateUrl: 'ngt-invest-summary.tmpl'

        scope:
            item: '='
            type: '='
