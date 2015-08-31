
do (_, angular) ->

    angular.module('controller').controller 'DashboardCtrl',

        _.ai '            @api, @user, @$scope, @$window, @$location', class
            constructor: (@api, @user, @$scope, @$window, @$location) ->

                @$window.scrollTo 0, 0

                invest_interest = @user.fund.investInterestAmount

                due = @user.fund.dueInAmount
                frozen = @user.fund.frozenAmount
                available = @user.fund.availableAmount

                total = due + frozen + available

                @$scope.fund = {
                    invest_interest
                    available
                    total
                }

                (@api
                    .fetch_user_coupons()

                    .then (data) =>

                        all_coupon_list = _.clone data

                        available_coupon_list =
                            _(all_coupon_list)
                                .filter (item) ->
                                    item.status in _.split 'INITIATED PLACED'
                                .value()

                        @$scope.available_coupon_length = available_coupon_list.length
                )

                @api.fetch_user_points().then (data) =>
                    @$scope.points = data


                # prefetch following API calls for getting out from cache directly later on

                @api.get_user_funds()
                @api.get_user_investments()


            logout: ->
                @api.logout().then =>
                    @$location.path '/'
                    @$window.location.reload()
