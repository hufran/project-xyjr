
do (_, angular) ->

    angular.module('controller').controller 'PaymentPoolBindCardCtrl',

        _.ai '            banks, @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$interval, @$routeParams', class
            constructor: (banks, @user, @api, @$scope, @$window, @$q, @$location, @$timeout, @$interval, @$routeParams) ->

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
                @captcha = {timer: null, count: 55, count_default: 55, has_sent: false, buffering: false}

                @api.get_province_list().then (data) =>
                    @$scope.province = data


            send_mobile_captcha: ->

                do @api.payment_pool_bind_card_sent_captcha

                @captcha.timer = @$interval =>
                    @captcha.count -= 1

                    if @captcha.count < 1
                        @$interval.cancel @captcha.timer
                        @captcha.count = @captcha.count_default
                        @captcha.buffering = false
                , 1000

                @captcha.has_sent = @captcha.buffering = true


            fetch_city: (province) ->

                @api.get_city_list_by_province(province).then (data) =>
                    @$scope.city = data


            bind_card: ({bankName, branchName, cardNo, cardPhone, city, province, smsCaptcha} = store) ->

                @submit_sending = true

                (@api.payment_pool_bind_card(bankName, branchName, cardNo, cardPhone, city, province, smsCaptcha)

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
