
do (_, angular) ->

    angular.module('controller').controller 'ListCtrl',

        _.ai '            @api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams, CATEGORY_MAP', class
            constructor: (@api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams, CATEGORY_MAP) ->

                @$window.scrollTo 0, 0

                category = @$routeParams.category

                angular.extend @$scope, {
                    category: category
                    page_path: @$location.path()[1..]
                    loading: true
                }

                product = _.get CATEGORY_MAP, category

                @$location.path 'list' unless product

                (@api.get_loan_list_by_config(product, 20, false)

                    .then ({results}) =>

                        @$scope.list =
                            _(results)
                                .compact()
                                .map map_loan_summary
                                .value()

                    .finally =>
                        @$scope.loading = false
                )

