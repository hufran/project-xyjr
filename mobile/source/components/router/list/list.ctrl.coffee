
do (_, angular, moment) ->

    angular.module('controller').controller 'ListCtrl',

        _.ai '            @api, @user, @$scope, @$rootScope, @$window, map_loan_summary, @$routeParams', class
            constructor: (@api, @user, @$scope, @$rootScope, @$window, map_loan_summary, @$routeParams) ->

                @$window.scrollTo 0, 0

                filter_type = @$routeParams.type

                @$scope.filter_type = filter_type
                @$scope.loading = true

                (@api.get_loan_list()
                    .success (data) =>

                        {open, scheduled, finished, settled} = data

                        scheduled.forEach (item) ->
                            item.time_open = moment(item.timeOpen).fromNow()
                            item.type = 'scheduled'

                        filter_loan =
                            _([open, scheduled, finished, settled])
                                .flatten()
                                .compact()
                                .map map_loan_summary
                                .filter (item) ->
                                    if filter_type
                                        return item.product_type is filter_type
                                    else
                                        return item.product_type in _.split 'LTB LXY QT'
                                .value()

                        filter_loan.remain = _.clone filter_loan
                        filter_loan.length = 0

                        @add_more(filter_loan)

                        @$scope.data = filter_loan

                    .finally =>
                        @$scope.loading = false
                )


            has_more: (list) ->

                list.remain?.length > 0


            add_more: (list) ->

                PAGE_SIZE = 4 * 1000

                while list.remain.length and PAGE_SIZE--
                    list.push list.remain.shift()
