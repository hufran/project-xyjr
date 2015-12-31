
do (_, angular) ->

    angular.module('controller').controller 'LYGCtrl',

        _.ai '            @user, @api, @$location, @$scope, @$window, @$q, @$uibModal, @map_loan_summary, @$routeParams', class
            constructor: (@user, @api, @$location, @$scope, @$window, @$q, @$uibModal, @map_loan_summary, @$routeParams) ->

                @$window.scrollTo 0, 0

                @back_path = @$routeParams.back or '/'
                @next_path = @$routeParams.next or @back_path

                @$scope.store = {}

                EXTEND_API @api


            has_enough_balance: (diff = false) ->

                if diff
                then @$scope.store.amount - @user.fund.availableAmount
                else @user.fund.availableAmount >= @$scope.store.amount


            evaluate: (price, min, max) ->

                return @$scope.evaluation = null unless price

                price = +price

                if !price or min < price > max
                    @$scope.store.price = min
                    @$window.alert _.template(@$scope.msg.PRICE_LIMIT) {min, max}
                    return

                @submitting = true

                (@api.lyg_check_allocation(price)

                    .then (response) ->
                        return {shouldInvest: 0, remainAmount: 0} if response.success isnt true
                        return response.data

                    .catch (response) =>
                        return @$q.reject(response) unless response.error is 'access_denied'

                        @$window.alert @$scope.msg.LOGIN_EXPIRED
                        @$window.location.reload()

                    .then ({shouldInvest, remainAmount}) =>

                        @$scope.evaluation = {
                            meant: +shouldInvest
                            remaining: +remainAmount
                            good_to_go: +remainAmount > 0 and +shouldInvest <= +remainAmount
                        }

                        @submitting = false
                )


            next: ({price, goods, staff}) ->

                @submitting = true

                (@api.lyg_check_allocation(price, goods, staff)

                    .then @api.process_response
                    .then @api.TAKE_RESPONSE_DATA

                    .then ({shouldInvest, remainAmount, loan, gomeGoodsName}) =>
                        @$scope.store.amount = +shouldInvest
                        @$scope.store.goods_name = gomeGoodsName
                        @$scope.loan = @map_loan_summary loan

                    .catch (data) =>
                        message = _.get data, 'error[0].message', 'UNKNOWN'
                        message = _.get @$scope.msg, message

                        @$window.alert message

                    .finally (data) =>
                        @submitting = false
                )


            submit: ({goods, price, staff, amount, password}) ->

                @submitting = true

                (@api.lyg_invest(goods, price, staff, amount, password)

                    .then @api.process_response
                    .then @api.TAKE_RESPONSE_DATA

                    .then ({goodsPickCode: goods_result, userShare}) =>
                        {
                            goodsPickCode: @$scope.pickup_code
                            timeExpired: @$scope.expire_time
                        } = goods_result

                        @prompt_coupon_sharing userShare?.id

                    .catch (data) =>
                        message = _.get data, 'error[0].message', 'UNKNOWN'
                        message = _.get @$scope.msg, message, message

                        @$window.alert message

                    .finally (data) =>
                        @submitting = false
                )


            prompt_coupon_sharing: (id) ->

                return unless id

                prompt = @$uibModal.open {
                    size: 'sm'
                    keyboard: false
                    backdrop: 'static'
                    windowClass: 'center ngt-share-coupon'
                    animation: true
                    templateUrl: 'components/templates/ngt-share-coupon.tmpl.html'

                    controller: _.ai '$scope', ($scope) =>
                        angular.extend $scope, {id}
                }

                once = @$scope.$on '$locationChangeStart', ->
                    prompt?.dismiss()
                    do once









    EXTEND_API = (api) ->

        api.__proto__.lyg_check_allocation = (price, goodsId, gomeUserId) ->

            @$http
                .get '/api/v2/invest/shouldInvest',
                    params: _.compact {price, goodsId, gomeUserId}
                    cache: false

                .then @TAKE_RESPONSE_DATA
                .catch @TAKE_RESPONSE_ERROR


        api.__proto__.lyg_invest = (goodsId, price, gomeUserId, amount, paymentPassword) ->

            @$http
                .post '/api/v2/invest/user/MYSELF/forOffline',
                    _.compact {goodsId, price, gomeUserId, amount, paymentPassword}

                .then @TAKE_RESPONSE_DATA
                .catch @TAKE_RESPONSE_ERROR
