
do (_, angular, moment) ->

    angular.module('controller').controller 'HomepageCtrl',

        _.ai '            @api, @user, @$scope, @$window, map_loan_summary, @$q', class
            constructor: (@api, @user, @$scope, @$window, map_loan_summary, @$q) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    page_path: './'
                    loading: true
                }

                (@$q
                    .all [
                        @api.get_loan_list_with_type 'LTB', 4
                        @api.get_loan_list_with_type 'LXY', 4
                    ]

                    .then (list) =>

                        all_loan =
                            _(list)
                                .pluck 'results'
                                .flatten()
                                .compact()
                                .map map_loan_summary
                                .map (item) ->
                                    if item.status is 'SCHEDULED'
                                        item.time_open = moment(item.timeOpen).fromNow()

                                    return item
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
