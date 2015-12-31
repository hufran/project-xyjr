
do (_, angular) ->

    angular.module('controller').controller 'HomepageCtrl',

        _.ai '            @api, @user, @$scope, @$rootScope, @$window, @$q, map_loan_summary, @$location', class
            constructor: (@api, @user, @$scope, @$rootScope, @$window, @$q, map_loan_summary, @$location) ->

                @$window.scrollTo 0, 0

                @$rootScope.state = 'landing'

                angular.extend @$scope, {
                    page_path: @$location.absUrl()
                    loading: true
                    carousel_height: do (width = @$window.document.body.clientWidth) ->
                        width * 300 / 640 # aspect ratio of banner image
                }

                product_list = _.split 'XSB XFD QYD BL'

                (@$q
                    .all product_list.map (product) =>
                        @api.get_loan_list_by_config product, 1

                    .then (response) =>

                        @$scope.list =
                            _(_.pluck response, 'results')
                                .flatten()
                                .compact()
                                .map map_loan_summary
                                .each (item) =>
                                    item.chart_options = {
                                        size: 176
                                        lineWidth: 4
                                        scaleColor: false
                                        barColor: '#F03644'
                                        trackColor: '#F1F1F1'
                                    }
                                .value()

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
