
do (_, angular) ->

    angular.module('controller').controller 'PaymentPoolBindCardCtrl',

        _.ai '            banks, @user, @api, @$scope, @$window, @$q, @mg_alert, @$location, @$timeout, @$interval, @$routeParams, @$uibModal', class
            constructor: (banks, @user, @api, @$scope, @$window, @$q, @mg_alert, @$location, @$timeout, @$interval, @$routeParams, @$uibModal) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    banks:null
                    province: null
                    city: null
                    businessNull:false
                    sourceId:@$routeParams.sourceId
                }

                @pay_type = 'lianlianPay'
                @back_path = @$routeParams.back

                @next_path = @$routeParams.next or 'dashboard'

                @submit_sending = false

                @error = {timer: null, timeout: 4000, message: '', on: false}
                @captcha = {timer: null, count: 60, count_default: 60, has_sent: false, buffering: false}

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


            fetch_branch: (cityCode, cardNo) ->

                return # remove this in case branch list should being fetched from remote API

                unless !!cityCode and !!cardNo
                    @$scope.branchs = []
                    return

                @api.get_bank_branch_name(cityCode, cardNo).then (data) =>
                    @$scope.branchs = data


            need_location: ->

                return true # always need location right now

                @$scope.store.bankName and @$scope.store.bankName not in @$scope.direct_paid_banks


            detection: (cardNo) ->

                @$scope.store.cardNo = parseInt(cardNo)

            on_change_business_type: ->

                if @$scope.store.businessType == '1'
                    @api.get_available_bank4App_list().then (data) =>
                        @$scope.banks = data
                        @$scope.businessNull = true;
                else if @$scope.store.businessType == '0'
                    if @pay_type == 'lianlianPay'
                        @api.get_LianLian_bank_list().then (data1) =>
                            @$scope.banks = data1
                            @$scope.businessNull = true;
                    else
                        @api.get_available_bank_list().then (data2) =>
                            @$scope.banks = data2
                            @$scope.businessNull = true;
                else
                    @$scope.banks = null
                    @$scope.businessNull = false;

            on_change_bank_name: ->

                return if @need_location()

                _.split('province city branchName').forEach (key) =>
                    _.set @$scope.store, key, ''
            clickOpenBank: ->

                @error.on = true
                @error.message = '请选择业务类型'
                @error.timer = @$timeout =>
                    @error.on = false
                , @error.timeout


            bind_card: ({bankName, branchName, cardNo, cardPhone, city, province, smsCaptcha,businessType}) ->
                cardNo = filterXSS(cardNo)
                smsCaptcha = filterXSS(smsCaptcha)
                if cardNo != undefined
                    if businessType == '0' || businessType == '1'

                    else
                        @error.on = true
                        @error.message = '请选择业务类型'
                        @error.timer = @$timeout =>
                            @error.on = false
                        , @error.timeout
                        return false
                @submit_sending = true

                check_input = (data) =>
                    error_msg = ''

                    _.each data, (value, key) =>
                        return if !!value

                        error_msg = @$scope.msg[key]
                        return false

                    return @$q.reject {error: [message: error_msg]} if error_msg
                    return true

                (@$q.resolve(@need_location())

                    .then (location_needed) ->
                        return check_input({cardNo}) unless !!cardNo
                        return check_input({bankName}) unless !!bankName
                        return check_input({city, province}) if location_needed
                        return check_input({smsCaptcha}) unless !!smsCaptcha

                    .then => @api.payment_pool_bind_card(bankName, branchName, cardNo, cardPhone, city, province, smsCaptcha)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .then (data) =>
                        if @$scope.sourceId != undefined
                            window.location.href = wxChatUrl+"/lend/homeA";
                        else
                            @mg_alert _.get data, 'data', 'wow...'
                                .result.finally =>
                                        @$location
                                        .path @next_path
                                        .search t: _.now()

                            @$scope.$on '$locationChangeStart', (event, new_path) =>
                                event.preventDefault()
                                @$window.location.href = new_path

                    .catch (data) =>
                        @submit_sending = false
                        @$timeout.cancel @error.timer

                        @error.on = true
                        @error.message = _.get data, 'error[0].message', '系统繁忙，请稍后重试！'

                        @error.timer = @$timeout =>
                            @error.on = false
                        , @error.timeout
                )






