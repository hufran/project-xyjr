
do (_, angular) ->

    angular.module('controller').controller 'DashboardCtrl',

        _.ai '            @api, @user, @$scope, @$rootScope, @$window, @$location', class
            constructor: (@api, @user, @$scope, @$rootScope, @$window, @$location) ->

                @$window.scrollTo 0, 0

                @$rootScope.state = 'dashboard'

                @$scope.fund = {
                    available: @user.fund.availableAmount
                    total: @user.fund.availableAmount + @user.fund.dueInAmount + @user.fund.frozenAmount
                    daily: @user.statistics.yesterdayIncome
                    total_interest: @user.statistics.investInterestAmount
                }
                (@api
                    .get_loan_list()

                    .then (data) =>
                        @$scope.curLoanId = data.settled[0].id || '8DF05DB9-D483-4584-A390-2E1D7CCD5C2C'
                )
                (@api
                    .fetch_user_coupons()

                    .then (data) =>

                        all_coupon_list = _.clone data
                        available_coupon_list =
                            _(all_coupon_list)
                                .filter (item) ->
                                    item.status in _.split 'INITIATED PLACED USING'
                                .value()

                        @$scope.available_coupon_length = available_coupon_list.length
                )

                (@api
                    .fetch_user_notifications()

                    .then (data) =>

                        all_notification_list = _.clone data.results

                        new_notification_list =
                            _(all_notification_list)
                                .filter (item) ->
                                    item.status is 'NEW'
                                .value()

                        @$scope.new_notification_length = new_notification_list.length
                )

                # prefetch following API calls for getting out from cache directly later on

                @api.get_user_funds()
                @api.get_user_investments()
                @api.payment_pool_banks()

                (@api
                .get_yesterday_income(@user.info.id)
                .then (data) =>
                    @$scope.yesterdayIncome = data.yesterdayYields
                )


            logout: ->

                @api.logout().then =>

                    @$location
                        .path '/'
                        .search t: _.now()

                    @$scope.$on '$locationChangeStart', (event, new_path) =>
                        event.preventDefault()
                        @$window.location.href = new_path
