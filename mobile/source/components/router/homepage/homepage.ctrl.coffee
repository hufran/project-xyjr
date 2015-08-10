
do (_, angular, moment) ->

    angular.module('controller').controller 'HomepageCtrl',

        _.ai '            @api, @$scope, @$rootScope, @$window, map_loan_summary', class
            constructor: (@api, @$scope, @$rootScope, @$window, map_loan_summary) ->

                @$window.scrollTo 0, 0

                @api.get_loan_list().success (data) =>

                    {open, scheduled, finished, settled} = data
                    list = [open, scheduled, finished, settled]

                    loan = map_loan_summary _(list).flatten().compact().first()

                    @$scope.loan = _.extend loan, chart_options: {
                        size: 100
                        scaleColor: false
                        barColor: '#68C9D5'
                        trackColor: '#EDEDED'
                    }


            num: (amount) ->
                amount = amount | 0
                is_myriad = amount.toString().length > 3

                return {
                    amount: amount
                    myriad: if is_myriad then (amount / 10000) | 0 else null
                }
