
do (_, angular) ->

    angular.module('controller').controller 'CouponCtrl',

        _.ai '            @data, @$scope, @$window, @$modal', class
            constructor: (@data, @$scope, @$window, @$modal) ->

                @$window.scrollTo 0, 0

                coupon_list = _.clone @data

                status_list = _.split 'INITIATED PLACED USED REDEEMED EXPIRED CANCELLED'

                coupon_group_object_by_status =
                    _(coupon_list)
                        .groupBy 'status'
                        .value()

                coupon_list =
                    _(status_list)
                        .map (status) ->
                            return coupon_group_object_by_status[status]
                        .flatten()
                        .compact()
                        .value()

                list = []
                list.remain = coupon_list
                list.length = 0

                @add_more(list)

                @$scope.data = list


            has_more: (list) ->

                list.remain?.length > 0


            add_more: (list) ->

                PAGE_SIZE = 4 * 1000

                while list.remain.length and PAGE_SIZE--
                    list.push list.remain.shift()
