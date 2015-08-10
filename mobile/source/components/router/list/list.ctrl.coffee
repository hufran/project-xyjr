
do (_, angular, moment) ->

    angular.module('controller').controller 'ListCtrl',

        _.ai '            @api, @user, @$scope, @$rootScope, @$window, map_loan_summary', class
            constructor: (@api, @user, @$scope, @$rootScope, @$window, map_loan_summary) ->

                @$window.scrollTo 0, 0

                (@api.get_loan_list().success (data) =>

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
                                item.product_type isnt 'UNKNOW'
                            .groupBy 'product_type'
                            .pick _.split 'SSGS GQ YQ'
                            .value()

                    all_group_loan = _.merge { ALL: all_loan }, group_loan

                    @$scope.tabs =
                        _(all_group_loan)
                            .each (list) ->
                                list.remain = _.clone list
                                list.length = 0
                            .value()
                )


            has_more: (list) ->

                list.remain?.length > 0


            add_more: (list) ->

                PAGE_SIZE = 4 * 1000

                while list.remain.length and PAGE_SIZE--
                    list.push list.remain.shift()
