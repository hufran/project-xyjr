
do (_ ,angular, moment, Math, Date) ->

    angular.module('controller').controller 'LoanCtrl',

        _.ai '            @user, @loan, @api, @$scope, @$window, map_loan_summary, @$routeParams, @$timeout', class
            constructor: (@user, @loan, @api, @$scope, @$window, map_loan_summary, @$routeParams, @$timeout) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    go_back_path: @$routeParams.go_back
                    loan: map_loan_summary @loan
                    investors: @api.get_loan_investors @loan.id
                }

                time_open_left = @loan.timeOpen - Date.now()

                if time_open_left > 0

                    @$timeout =>
                        if @$routeParams.id is @loan.id
                            @$window.location.reload()
                    , time_open_left + 500, false

                else if @loan.status is 'SCHEDULED'

                    @$window.location.reload()







    angular.module('directive').directive 'loanSummary', ->

        restrict: 'AE'
        templateUrl: 'components/templates/ngt-loan-summary.tmpl.html?t={ts}'

        scope:
            loan: '='








    angular.module('factory').factory 'map_loan_summary', -> (item) ->

        CHART_OPTIONS = ->
            size: 40
            lineWidth: 3
            scaleColor: false
            barColor: '#007EC5'
            trackColor: '#EEE'

        loanRequest = item.loanRequest

        rate = parseFloat (item.rate / 100).toFixed(1)

        invest_percent_int = (item.investPercent * 100) | 0
        invest_percent_int = 100 if item.status in _.split 'SETTLED FINISHED'

        balance = item.balance
        balance = 0 if item.status not in _.split 'OPENED SCHEDULED'
        balance_myriad = (balance / 10000) | 0 && (balance / 10000)

        (finished_date = do (item, {days, time_settled, due_date} = {}) ->
            days = item.duration.totalDays
            time_settled = item.timeSettled

            unless time_settled
                # 借款成立日
                due_date = item.timeout * 60 * 60 * 1000 + item.timeOpen
                time_settled = due_date + 1 * 24 * 60 * 60 * 1000

            return new Date +moment(time_settled).add(days, 'd')
        )

        result = _.pick item, _.split 'id title status amount method'

        return _.merge result, {

            raw: item

            rate
            invest_percent_int
            finished_date

            time_open: item.timeOpen
            time_close: item.timeLeft + Date.now()

            corporate_name: item.corporationShortName
            product_key: loanRequest.productKey
            product_type: loanRequest.productKey?.trim().match(/^\w+/)[0] or 'UNKNOW'
            value_date: loanRequest.valueDate

            balance
            balance_myriad

            amount_myriad: (item.amount / 10000) | 0
            total_days: item.duration.totalDays
            total_months: item.duration.totalMonths

            chart_options: _.merge CHART_OPTIONS(), do (data = {}) ->
                data.barColor = '#007EC5' unless item.status is 'OPENED'
                return data
        }
