
do (_, angular) ->

    angular.module('controller').controller 'ListCtrl',

        _.ai '            @api, @user, @$scope, @$rootScope, @$location, @$window, @$q, map_loan_summary, @$routeParams', class
            constructor: (@api, @user, @$scope, @$rootScope, @$location, @$window, @$q, map_loan_summary, @$routeParams) ->

                @$window.scrollTo 0, 0

                @$rootScope.state = 'list'

                angular.extend @$scope, {
                    page_path: @$location.path()[1..]
                    current_tab: @$routeParams.tab or 'XSZX'
                    loading: true
                }

                key_product_list = [
                    {
                        key: 'YGB'
                        product: 'YGB'
                        size: 1
                    }
                    {
                        key: 'XSZX'
                        product: 'XSB'
                        size: 3
                    }
                    {
                        key: 'DQLC'
                        product: 'XFD,QYD,BL'
                        size: 99
                    }
                ]

                key_group = _.pluck key_product_list, 'key'
                product_group = _.pluck key_product_list, 'product'
                size_group = _.pluck key_product_list, 'size'

                (@$q
                    .all product_group.map (product, index) =>
                        @api.get_loan_list_by_config product, size_group[index], false

                    .then (response) =>

                        status_list = _.split 'OPENED SCHEDULED FINISHED SETTLED CLEARED'

                        @$scope.tabs =
                            _(_.pluck response, 'results')
                                .map (list, index) ->
                                    _(list)
                                        .flatten()
                                        .compact()
                                        .map map_loan_summary
                                        .sortBy (item) ->
                                            status_list.indexOf item.status
                                        .tap (list) ->
                                            list.key = key_group[index]
                                        .value()

                                .tap (tabs) ->
                                    YGB_LIST = tabs.shift()
                                    tabs[0].unshift YGB_LIST[0] if YGB_LIST.length

                                    tabs.splice 1, 0, {key: 'LYG'}

                                .tap (tabs) =>
                                    _.find(tabs, key: @$scope.current_tab).active = true

                                .value()

                    .finally =>
                        @$scope.loading = false
                )


            on_tab: (tab) ->

                return unless tab is 'LYG'

                @$location
                    .path 'lyg'
                    .search back: 'list'

                return

                (@api.fetch_current_user()

                    .then (user) =>
                        switch
                            when user.has_payment_account isnt true
                                @$location
                                    .replace()
                                    .path 'dashboard/payment/register'
                                    .search
                                        back: 'list'
                                        next: 'list/LYG'

                            when user.has_payment_password isnt true
                                @$location
                                    .replace()
                                    .path 'dashboard/payment/password'
                                    .search
                                        back: 'list'
                                        next: 'list/LYG'

                    .catch =>

                        @$location
                            .replace()
                            .path 'login'
                            .search next: 'list/LYG'
                )
