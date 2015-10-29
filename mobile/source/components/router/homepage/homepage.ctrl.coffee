
do (_, angular, moment) ->

    angular.module('controller').controller 'HomepageCtrl',

        _.ai '            @api, @user, @$scope, @$window, map_loan_summary', class
            constructor: (@api, @user, @$scope, @$window, map_loan_summary) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    page_path: './'
                    loading: true
                }

                (@api.get_loan_list()

                    .success (data) =>

                        {open, scheduled, finished, settled} = data

                        scheduled.forEach (item) ->
                            item.time_open = moment(item.timeOpen).fromNow()
                            item.type = 'scheduled'

                        all_loan =
                            _([open, scheduled, finished, settled])
                                .flatten()
                                .compact()
                                .map map_loan_summary
                                .value()

                        group_loan =
                            _(all_loan)
                                .filter (item) ->
                                    item.product_type isnt 'UNKNOWN'
                                .groupBy 'product_type'
                                .pick _.split 'LTB LXY'
                                .value()

                        @$scope.list = group_loan

                    .finally =>
                        @$scope.loading = false
                )


            num: (amount) ->
                amount = amount | 0
                is_myriad = amount.toString().length > 3

                return {
                    amount: amount
                    myriad: if is_myriad then (amount / 10000) | 0 else null
                }
