
do (_, angular) ->

    angular.module('controller').controller 'PaymentPoolBindCardCtrl',

        _.ai '            banks, @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams', class
            constructor: (banks, @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$routeParams) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    banks
                    province: null
                    city: null
                }

                @back_path = @$routeParams.back
                @next_path = @$routeParams.next or 'dashboard'

                @submit_sending = false

                @error = {timer: null, timeout: 4000, message: '', on: false}

                @api.get_province_list().then (data) =>
                    @$scope.province = data


            fetch_city: (province) ->

                @api.get_city_list_by_province(province).then (data) =>
                    @$scope.city = data


            bind_card: ({bankName, cardNo, cardPhone, city, province} = store) ->

                @submit_sending = true

                (@api.payment_pool_bind_card(bankName, cardNo, cardPhone, city, province)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (data) =>
                        @$window.alert _.get data, 'data', 'wow...'
                        @$location.path @next_path
                        @$scope.$on '$locationChangeStart', (event, new_path) =>
                            event.preventDefault()
                            @$window.location = new_path

                    .catch (data) =>
                        @submit_sending = false
                        @$timeout.cancel @error.timer

                        @error.on = true
                        @error.message = _.get data, 'error[0].message', 'something happened...'

                        @error.timer = @$timeout =>
                            @error.on = false
                        , @error.timeout
                )
