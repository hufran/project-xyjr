
do (_, angular, moment) ->

    angular.module('controller').controller 'ListCtrl',

        _.ai '            @api, @user, @$scope, @$rootScope, @$location, @$window, map_loan_summary, @$routeParams', class
            constructor: (@api, @user, @$scope, @$rootScope, @$location, @$window, map_loan_summary, @$routeParams) ->

                @$window.scrollTo 0, 0

                filter_type = @$routeParams.type

                angular.extend @$scope, {
                    filter_type: filter_type
                    page_path: @$location.path()[1..]
                    loading: true
                }

                (@api.get_loan_list_with_type(filter_type, 20)

                    .then ({results}) =>

                        filter_loan =
                            _(results)
                                .compact()
                                .map map_loan_summary
                                .map (item) ->
                                    if item.status is 'SCHEDULED'
                                        item.time_open = moment(item.timeOpen).fromNow()

                                    return item
                                .value()

                        filter_loan.remain = _.clone filter_loan
                        filter_loan.length = 0

                        @add_more(filter_loan)

                        @$scope.data = filter_loan

                    .finally =>
                        @$scope.loading = false
                )


            has_more: (list) ->

                list?.remain?.length > 0


            add_more: (list) ->

                PAGE_SIZE = 4 * 1000

                while list.remain.length and PAGE_SIZE--
                    list.push list.remain.shift()
