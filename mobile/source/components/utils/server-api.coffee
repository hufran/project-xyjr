
do (_, angular, moment, Array) ->

    WWW_FORM_HEADER = 'Content-Type': 'application/x-www-form-urlencoded'
    TAKE_RESPONSE_DATA = (response) -> response.data

    ARRAY_JOIN = _.partialRight Array::join, ''


    angular.module('service').service 'api',

        _.ai '            @user, @$http, @$resource, @$q, @param, @$sce', class
            constructor: (@user, @$http, @$resource, @$q, @param, @$sce) ->

                @access_token = 'cookie'
                @user_fetching_promise = null

                @param_traditional = _.partialRight @param, true


            fetch_current_user: ->

                if @user_fetching_promise
                    return @user_fetching_promise

                deferred = do @$q.defer
                @user_fetching_promise = deferred.promise

                unless @access_token
                    do deferred.reject
                    return @user_fetching_promise

                if @user.has_logged_in
                    deferred.resolve @user
                    return @user_fetching_promise

                (@$http.get('/api/v2/user/MYSELF')

                    .then (response, {api_list} = {}) =>
                        @user.info = response.data

                        api_list = _.split '
                            statistics/invest
                            userfund
                            payment
                            fundaccounts
                            authenticates
                            paymentPasswordHasSet
                        '

                        @$q.all api_list.map (path) =>
                            @$http.get "/api/v2/user/#{ @user.info.id }/#{ path }"

                    .then (response) =>
                        [
                            statistics
                            @user.fund
                            @user.payment
                            @user.fund_accounts
                            @user.authenticates
                            @user.has_payment_password

                        ] = _.pluck response, 'data'

                        _.extend @user.fund, _.pick statistics, _.split '
                            investInterestAmount
                            investingPrincipalAmount
                            investingInterestAmount
                            investFrozenAmount
                        '

                        deferred.resolve @user.ready true

                    .catch =>
                        deferred.reject @user_fetching_promise = null
                )

                return @user_fetching_promise


            get_user_investments: (size = 99, cache = true) ->

                query_set = @param_traditional {
                    status: _.split 'SETTLED OVERDUE BREACH FINISHED PROPOSED FROZEN CLEARED'
                }

                @$http.get("/api/v2/user/MYSELF/invest/list/0/#{ size }?#{ query_set }", {cache})
                    .then (response) ->
                        response.data?.results or []


            get_user_funds: ->

                convert_to_day = (date) ->
                    moment(date.format 'YYYY-MM-DD').unix() * 1000

                query_set = {
                    type: 'ALL'
                    allStatus: false
                    allOperation: true
                    startDate: convert_to_day moment().subtract 1, 'y'
                    endDate: convert_to_day moment().add 1, 'd'
                    page: 1
                    pageSize: 40
                }

                @$http
                    .get '/api/v2/user/MYSELF/funds',
                        params: query_set
                        cache: true

                    .then TAKE_RESPONSE_DATA


            get_carousel_banners: ->

                @$http
                    .get '/api/v2/cms/mobileBanners', cache: true

                    .then TAKE_RESPONSE_DATA


            get_announcement: ->

                encode_name_value = '%E6%9C%80%E6%96%B0%E5%85%AC%E5%91%8A'

                (@$http
                    .get "/api/v2/cms/category/PUBLICATION/name/#{ encode_name_value }", cache: true

                        .then (response) =>

                            channel_id = _.get response, 'data[0].channelId'

                            return $q.reject() unless channel_id

                            @$http
                                .get "/api/v2/cms/channel/#{ channel_id }",
                                    params: {page: 1, pagesize: 20}
                                    cache: true

                        .then (response) =>

                            return response.data?.results
                )


            get_loan_list: ->

                @$http.get('/api/v2/loans/summary', cache: false)


            get_loan_detail: (id, cache = false) ->

                @$http.get('/api/v2/loan/' + id, {cache})
                      .then TAKE_RESPONSE_DATA


            fetch_invest_analyse: ({amountValue, dueDay, dueMonth, dueYear, annualRate, paymentMethod}) ->
                store =            {amountValue, dueDay, dueMonth, dueYear, annualRate, paymentMethod}

                @$http
                    .post '/api/v2/loan/request/analyse',
                        @param store
                        headers: WWW_FORM_HEADER


            get_invest_contract: (id, deferred = @$q.defer()) ->

                deferred.resolve "/api/v2/user/MYSELF/invest/#{ id }/contract"
                return deferred.promise


            fetch_user_points: ->

                @$http
                    .get '/api/v2/points/user/MYSELF/getTotalPoints', cache: true
                    .then TAKE_RESPONSE_DATA


            fetch_user_coupons: (type = 'ALL', cache = true) ->

                @coupon_cache ?= {}

                deferred = do @$q.defer

                ALL_TYPE = _.split 'CASH INTEREST PRINCIPAL REBATE'

                api_type_list = if type in ALL_TYPE then [type] else ALL_TYPE

                if cache and _.has @coupon_cache, type
                    deferred.resolve _.get @coupon_cache, type
                    return deferred.promise

                (@$q
                    .all api_type_list.map (type) =>

                        @$http
                            .post '/api/v2/coupon/MYSELF/coupons',
                                @param {type, page: 1, size: 40}
                                headers: WWW_FORM_HEADER

                    .then (response) =>

                        coupon_group_array_by_type = _.pluck response, 'data.data.results'

                        coupon_list =
                            _(coupon_group_array_by_type)
                                .flatten()
                                .compact()
                                .value()

                        _.set @coupon_cache, type, coupon_list if cache

                        deferred.resolve coupon_list

                    .catch ->
                        do deferred.reject
                )

                return deferred.promise


            fetch_coupon_list: (amount, months) ->

                @$http
                    .post '/api/v2/coupon/MYSELF/listCoupon',
                        @param {months, amount}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            get_loan_investors: (id) ->

                @$resource('/api/v2/loan/:id/invests', {id}).query()


            send_to_non_pasword_tender: (id, amount, coupon) ->

                path = ARRAY_JOIN.call [
                    '/api/v2'
                    '/upayment'
                    '/tenderNoPwd/user/MYSELF'
                    '/loan/', id
                    '/amount/', amount
                ]

                @$http
                    .post path,
                        @param {placementId: coupon or ''}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            login: (loginName, password) ->

                @$http
                    .post '/login/ajax',
                        @param {loginName, password}
                        headers: WWW_FORM_HEADER


            logout: ->

                @$http.post '/logout', {}, {
                    headers: 'X-Requested-With': 'XMLHttpRequest'
                }


            payment_pool_register: (name, idNumber) ->

                @$http
                    .post '/api/v2/lianlianpay/authenticateUser/MYSELF',
                        @param {name, idNumber}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_pool_set_password: (password) ->

                @$http
                    .post '/api/v2/user/MYSELF/resetPaymentPassword',
                        @param {password}
                        headers: WWW_FORM_HEADER

                    .then (response) -> success: response.data is true
                    .catch TAKE_RESPONSE_DATA


            payment_pool_bind_card: (bankName, cardNo, cardPhone, city, province) ->

                @$http
                    .post '/api/v2/lianlianpay/bindCard/MYSELF',
                        @param {bankName, cardNo, cardPhone, city, province}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_pool_unbind_card: (cardNo, paymentPassword) ->

                @$http
                    .post '/api/v2/lianlianpay/deleteCard/MYSELF',
                        @param {cardNo, paymentPassword}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            get_available_bank_list: ->

                @$http.get '/api/v2/lianlianpay/banks', cache: true

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            get_province_list: ->

                @$http.get '/api/v2/lianlianpay/provinceCodes', cache: true

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            get_city_list_by_province: (province) ->

                @$http.get '/api/v2/lianlianpay/provinceCityCodes/' + province, cache: true

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_ump_register: (userName, idCode) ->

                @$http
                    .post '/api/v2/upayment/register/MYSELF',
                        @param {userName, idCode}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_ump_non_password_bind_card: (cardId) ->

                @$http
                    .post '/api/v2/upayment/bindCardNoPwd/MYSELF',
                        @param {cardId}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_ump_non_password_recharge: (amount) ->

                @$http
                    .post '/api/v2/upayment/netSaveNoPwd/MYSELF',
                        @param {amount}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_ump_non_password_withdraw: (withdraw) ->

                @$http
                    .post '/api/v2/upayment/withdrawNoPwd/MYSELF',
                        @param {withdraw}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            register: (password, mobile, mobile_captcha) ->

                @$http
                    .post '/api/v2/register',
                        @param {password, mobile, mobile_captcha}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            mobile_encrypt: (mobile) ->

                @$http
                    .post '/api/v2/users/mobile/encrypt',
                        @param {mobile}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            fetch_register_captcha: ->

                @$http
                    .get '/api/v2/captcha?timestamp=' + _.now()
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            fetch_password_captcha: ->

                @$http
                    .get '/api/v2/register/captcha?timestamp=' + _.now()
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            reset_password: (loginName, mobile, captcha, captcha_token) ->

                @$http
                    .post '/api/v2/auth/reset_password',
                        @param {loginName, mobile, captcha}
                        params: {captcha_token, captcha_answer: captcha}
                        headers: WWW_FORM_HEADER

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            send_verification_code: (mobile, captcha_answer, captcha_token) ->

                @$http
                    .get '/register/ajax/smsCaptcha',
                        params: {mobile, captcha_answer, captcha_token}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA

