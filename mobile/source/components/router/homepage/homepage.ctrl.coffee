
do (_, angular) ->

    angular.module('controller').controller 'HomepageCtrl',

        _.ai '            @api, @user, @$scope, @$window, @$q, map_loan_summary, @$location, CATEGORY_MAP', class
            constructor: (@api, @user, @$scope, @$window, @$q, map_loan_summary, @$location, CATEGORY_MAP) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    page_path: './'
                    loading: true
                    carousel_height: do (width = @$window.document.body.clientWidth) ->
                        # width * 300 / 640 # aspect ratio of banner image
                }

                product_list = _.values CATEGORY_MAP

                (@$q
                    .all product_list.map (product) =>
                        @api.get_loan_list_by_config product, 1, false

                    .then (response) =>

                        @$scope.list =
                            _(_.pluck response, 'results')
                                .flatten()
                                .compact()
                                .map map_loan_summary
                                .each (item) =>
                                    item.category =
                                        _.findKey CATEGORY_MAP, (product) ->
                                            product == item.product_type

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









    angular.module('controller').constant 'CATEGORY_MAP', {
        XSB: 'XSB'
        HDB: 'HDB'
        XNB: 'XNB'
        XDB: 'XDB'
        XJB: 'XJB'
    }

