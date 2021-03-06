
do (_, angular, moment, Array) ->

    WWW_FORM_HEADER = 'Content-Type': 'application/x-www-form-urlencoded'

    TAKE_RESPONSE_DATA = (response) -> response.data
    TAKE_RESPONSE_ERROR = (q, response) -> q.reject response.data

    ARRAY_JOIN = _.partialRight Array::join, ''


    angular.module('service').service 'api',

        _.ai '            @user, @$http, @$resource, @$q, @param, @$sce', class
            constructor: (@user, @$http, @$resource, @$q, @param, @$sce) ->

                @access_token = 'cookie'
                @user_fetching_promise = null

                TAKE_RESPONSE_ERROR = _.partial TAKE_RESPONSE_ERROR, @$q

                @TAKE_RESPONSE_ERROR = TAKE_RESPONSE_ERROR
                @TAKE_RESPONSE_DATA = TAKE_RESPONSE_DATA

                @process_response = (data) =>
                    return @$q.reject(data) unless data?.success is true
                    return data


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
                            fundaccounts
                            authenticates
                            paymentPasswordHasSet
                        '

                        api_list = api_list.map (path) =>
                            @$http.get "/api/v2/user/#{ @user.info.id }/#{ path }"

                        api_list.push @$http.get '/api/v2/user/MYSELF/inviteCode'

                        return @$q.all api_list

                    .then (response) =>
                        [
                            @user.statistics
                            @user.fund
                            @user.fund_accounts
                            @user.authenticates
                            @user.has_payment_password
                            invite_code

                        ] = _.pluck response, 'data'

                        @user.info.invite_code = invite_code.data

                        _.extend @user.fund, _.pick @user.statistics, _.split '
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

                query_set = {
                    status: _.split 'SETTLED OVERDUE BREACH FINISHED PROPOSED FROZEN CLEARED'
                }

                @$http
                    .get "/api/v2/user/MYSELF/invest/list/0/#{ size }",
                        params: query_set
                        cache: cache

                    .then (response) ->
                        response.data?.results or []


            get_user_funds: ->

                convert_to_day = (date) ->
                    moment(date.format 'YYYY-MM-DD').unix() * 1000

                query_set = {
                    type: _.split 'INVEST WITHDRAW DEPOSIT INVEST_REPAY FEE_WITHDRAW TRANSFER OFFLINE_DEPOSIT'
                    allStatus: false
                    allOperation: true
                    startDate: convert_to_day moment().subtract 1, 'y'
                    endDate: convert_to_day moment().add 1, 'd'
                    page: 1
                    pageSize: 999
                }

                @$http
                    .get '/api/v2/user/MYSELF/funds/query',
                        params: query_set
                        cache: false

                    .then TAKE_RESPONSE_DATA


            get_carousel_banners: ->

                @$http
                    .get '/api/v2/cms/mobileBanners', cache: true

                    .then TAKE_RESPONSE_DATA


            get_announcement: ->

                encode_name_value = '%E5%B9%B3%E5%8F%B0%E5%85%AC%E5%91%8A'

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

                @$http
                    .get('/api/v2/loans/summary', cache: false)

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            get_loan_list_by_config: (product, size = 10, cache = true) ->

                query_set = {
                    status: 'SCHEDULED'
                    minDuration: 0
                    maxDuration: 100
                    minRate: 0
                    maxRate: 100
                    minAmount: 1
                    maxAmount: 100000000
                    pageSize: size
                    currentPage: 1
                }

                @$http
                    .get "/api/v2/loans/getLoanWithPage",
                        params: _.compact _.merge {product}, query_set
                        cache: cache

                    .then TAKE_RESPONSE_DATA


            get_project_name_list: ->

                @$http.get '/api/v2/navigation/listDisplayProductForPc/h5', cache: true

                .then TAKE_RESPONSE_DATA
                .catch TAKE_RESPONSE_DATA


            get_loan_detail: (id, cache = false) ->

                @$http.get('/api/v2/loan/' + id, {cache})
                      .then TAKE_RESPONSE_DATA

            get_protocol_detail: (name) ->
                
                @$http.get('/api/v2/cms/category/DECLARATION/name/' + name)
                    .then TAKE_RESPONSE_DATA

            get_repayment_detail: (id, cache = false) ->

                @$http
                    .get "/api/v2/loan/invest/#{ id }/repayments", {cache}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            get_yesterday_income: (id, cache = false) ->

                @$http
                    .get "/api/v2/user/#{ id }/userfundNew", {cache}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR
            get_article: (category,name, cache = false) ->
#                console.log category
#                console.log name
                @$http
                    .get "/api/v2/cms/category/#{ category }/name/"+name, {cache}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR

            get_category: (category, cache = false) ->

                @$http
                    .get "/api/v2/cms/channels", {cache}
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            fetch_invest_analyse: ({amountValue, dueDay, dueMonth, dueYear, annualRate, paymentMethod}) ->
                store =            {amountValue, dueDay, dueMonth, dueYear, annualRate, paymentMethod}

                @$http
                    .post '/api/v2/loan/request/analyse', store


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
                            .post '/api/v2/coupon/MYSELF/coupons', {type, page: 1, size: 100}

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


            fetch_coupon_list: (amount, months, loanId) ->

                @$http
                    .post '/api/v2/coupon/MYSELF/listCoupon', {months, amount, loanId}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            fetch_coupon_list_select: (id) ->

         

                @$http
                    .get "/api/v2/rebateCounpon/listUserCouponPlacement/#{ id }"
                    #.get "/api/v2/rebateCounpon/listUserCouponPlacement/43F497BB-2BF8-4484-A1CB-3FFEB56B81ED"					

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            get_agreement_name: (id) ->



                @$http
                    .get "/api/v2/loan/getLoan4Pc/#{ id }"

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            redeem_coupon: (placementId) ->

                @$http
                    .post '/api/v2/coupon/MYSELF/redeemCoupon', {placementId}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            fetch_user_notifications: ->

                @$http
                    .get '/api/v2/message/user/MYSELF/notifications',
                        params: {page: 1, pageSize: 99}
                        cache: false

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            mark_as_read_notification: (id) ->

                @$http
                    .get "/api/v2/message/markAsRead/#{ id }"

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            get_loan_investors: (id) ->

                @$http
                    .get "/api/v2/loan/#{ id }/invests"

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            send_to_non_pasword_tender: (id, amount, coupon) ->

                path = ARRAY_JOIN.call [
                    '/api/v2'
                    '/upayment'
                    '/tenderNoPwd/user/MYSELF'
                    '/loan/', id
                    '/amount/', amount
                ]

                @$http
                    .post path, _.compact {placementId: coupon or ''}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            login: (loginName, password) ->

                @$http
                    .post '/api/web/login', {loginName, password, source: 'mobile', channel: 'H5'}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            logout: ->

                @$http.post '/logout', {}, {
                    headers: 'X-Requested-With': 'XMLHttpRequest'
                    params: source: 'H5'
                }


            check_mobile: (mobile) ->

                @$http
                    .post '/api/v2/register/check_mobile', {mobile}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            check_invite_code: (inviteCode) ->

                @$http
                    .post '/api/v2/users/check/inviteCode', {inviteCode}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            bind_social: (socialType, socialId) ->

                @$http
                    .post '/api/v2/user/MYSELF/bind_social', {socialType, socialId}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_pool_register: (name, idNumber) ->

                @$http
                    .post '/api/v2/guozhengtong/authenticateUser/MYSELF',
                        _.compact {name, idNumber, source: 'H5'}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            payment_pool_withdraw: (amount, paymentPassword) ->

                @$http
                    .post '/api/v2/yeepay/withdraw/MYSELF', {amount, paymentPassword}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            payment_pool_check_password: (password) ->

                return @$q.reject() unless password

                @$http
                    .get '/api/v2/user/MYSELF/validatePaymentPassword',
                        params: {password}

                    .then (response) -> success: response.data is true
                    .catch TAKE_RESPONSE_DATA


            payment_pool_set_password_send_captcha: ->

                @$http
                    .post '/api/v2/smsCaptcha/MYSELF',
                        {smsType: 'CONFIRM_CREDITMARKET_RESET_PAYMENTPASSWORD'}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            payment_pool_set_password: (password, smsCaptcha) ->

                @$http
                    .post '/api/v2/user/MYSELF/resetPaymentPassword',
                        {password, smsCaptcha, source: 'H5'}

                    .then (response) -> success: response.data is true
                    .catch TAKE_RESPONSE_ERROR


            payment_pool_bind_card_sent_captcha:  ->

                @$http
                    .post '/api/v2/smsCaptcha/MYSELF', {smsType: 'CREDITMARKET_CAPTCHA'}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA

            payment_pool_send_captcha: (userid,transtype,cardPhone,cardnbr,username)->
                @$http
                    .post '/api/v2/lccb/sendMsg/'+userid,{transtype:transtype,cardPhone:cardPhone,cardnbr:cardnbr,username:username}
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR

            payment_pool_custody_bind:(userid,realName,idNumber,bankName,cardNo,cardPhone,smsCaptcha,smsid)->
                @$http
                    .post '/api/v2/lccb/bindCard/'+userid,
                        _.compact {realName,idNumber,bankName,cardNo,cardPhone,smsCaptcha,smsid,source:"H5"}
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA

            payment_pool_recharge: (userid, bankcode, cardnbr, transamt, smsid, validatemsg)->
                @$http
                    .post '/api/v2/lccb/deposit/'+userid,
                        _.compact {bankcode,cardnbr,transamt,smsid,validatemsg}
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA

            payment_pool_custody_withdraw:(amount, paymentPassword, smsid, validatemsg)->
                @$http
                    .post '/api/v2/lccb/withdraw/MYSELF',{amount, paymentPassword, smsid, validatemsg}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR
            payment_pool_getLccbId:(userId)->
                @$http
                    .get '/api/v2/lccb/getLccbId/'+userId
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR

            payment_pool_bank_limit:(bank)->
                @$http
                    .get '/api/v2/lccb/banksInLimit/'+bank
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR

            payment_pool_lccb_checkIsChangeBank:(userId)->
                @$http
                    .post '/api/v2/lccb/checkIsChangeBank/'+userId
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR 

            payment_pool_lccb_sendOldMobile:(userId)->
                @$http
                    .post '/api/v2/lccb/sms2OldMobile/'+userId
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR 

            payment_pool_lccb_checkOldMobile:(userId,smsCaptcha)->
                @$http
                    .post '/api/v2/lccb/checkSmsCaptcha4OldMobile/'+userId,{smsCaptcha:smsCaptcha}
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR 

            payment_pool_persionInit:(userId,smsid,smsCaptcha)->
                @$http
                    .post '/api/v2/lccb/persionInit/'+userId,
                        _.compact {smsid,smsCaptcha}
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR

            payment_pool_banks:()->
                @$http
                    .get '/api/v2/lccb/banks'
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR

            payment_pool_lccb_accredit:(userId,smsid,validatemsg)->
                @$http
                    .post '/api/v2/lccb/userAuth/'+userId,
                        _.compact {smsid,validatemsg}
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR

            payment_pool_lccb_investValidate:(userId,paymentPassword)->
                @$http
                    .post '/api/v2/validate/lccbInvest/'+userId,
                        _.compact {paymentPassword}
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR
            
            payment_pool_lccb_withdrawValidate:(userId,paymentPassword)->
                @$http
                    .post '/api/v2/validate/lccbWithdraw/'+userId,
                        _.compact {paymentPassword}
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR

            payment_pool_change_card:(userId,smsid,validatemsg,userphonenum,bankcode,cardnbr)->      
                @$http
                    .post '/api/v2/lccb/userChangeBank/'+userId,
                        _.compact {smsid, validatemsg, userphonenum, bankcode, cardnbr}
                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA

            payment_pool_bind_card: (bankName, branchName, cardNo, cardPhone, city, province, smsCaptcha) ->

                @$http
                    .post '/api/v2/yeepay/bindCard/MYSELF',
                        _.compact {bankName, branchName, cardNo, cardPhone, city, province, smsCaptcha, source: 'H5'}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_pool_unbind_card: (cardNo, paymentPassword) ->

                @$http
                    .post '/api/v2/yeepay/deleteCard/MYSELF', {cardNo, paymentPassword, source: 'H5'}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_pool_tender: (loanId, paymentPassword, amount, placementId = '',smsid,smsCaptcha) ->

                @$http
                    .post '/api/v2/invest/tender/MYSELF',
                        _.compact {loanId, paymentPassword, amount, placementId,smsid,smsCaptcha}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_pool_rebeat: (loanId, paymentPassword, amount, id, rebateAmount, smsid, smsCaptcha) ->

                @$http
                    .post "/api/v2/invest/tenderUseRebate/#{ id }", {loanId, paymentPassword, amount, rebateAmount, smsid, smsCaptcha}
                        #_.compact {loanId, paymentPassword, amount, placementId}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            get_available_bank_list: ->

#                @$http.get '/api/v2/yeepay/banks', cache: true
                @$http.get '/api/v2/jdpay/banks', cache: true

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA

            get_available_bank4App_list: ->

                @$http.get '/api/v2/jdpay/banks4AppServer', cache: true

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA

            get_LianLian_bank_list: ->

                @$http.get '/api/v2/lianlianpay/banks', cache: true

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            get_province_list: ->

                @$http.get '/api/v2/yeepay/provinceCodes', cache: true

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            get_city_list_by_province: (province) ->

                @$http.get '/api/v2/yeepay/provinceCityCodes/' + province, cache: true

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            get_bank_branch_name: (cityCode, cardNo) ->

                path = [cityCode, '%E9%93%B6%E8%A1%8C', cardNo].join '/'

                @$http.get "/api/v2/lianlianpay/bankBranches/#{ path }", cache: true

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            payment_ump_register: (userName, idCode) ->

                @$http
                    .post '/api/v2/upayment/register/MYSELF', {userName, idCode}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_ump_non_password_bind_card: (cardId) ->

                @$http
                    .post '/api/v2/upayment/bindCardNoPwd/MYSELF', {cardId}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_ump_non_password_recharge: (amount) ->

                @$http
                    .post '/api/v2/upayment/netSaveNoPwd/MYSELF', {amount}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            payment_ump_non_password_withdraw: (withdraw) ->

                @$http
                    .post '/api/v2/upayment/withdrawNoPwd/MYSELF', {withdraw}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            register: (password, mobile, mobile_captcha, optional = {}) ->

                optional = _.compact optional

                @$http
                    .post '/api/web/register/submit',
                        _.merge optional, {password, mobile, mobile_captcha, source: 'H5'}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            mobile_encrypt: (mobile) ->

                @$http
                    .post '/api/v2/users/mobile/encrypt', {mobile}

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


            reset_password: (mobile, captcha, newPassword) ->

                @$http
                    .post '/api/v2/auth/reset_password/password',
                        _.compact {mobile, captcha, newPassword}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            change_password: (mobile, currentPassword, newPassword) ->

                @$http
                    .post '/api/v2/user/MYSELF/change_password',
                        _.compact {mobile, currentPassword, newPassword, source: 'H5'}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            send_verification_code: (mobile, captcha_answer, captcha_token) ->

                @$http
                    .get '/api/v2/users/smsCaptcha',
                        params: _.compact {mobile, captcha_answer, captcha_token}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            send_captcha_for_reset_password: (mobile) ->

                @$http
                    .get '/api/v2/users/smsCaptcha/changePwd',
                        params: {mobile}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_DATA


            exchange_wechat_signature: (data) ->

                @$http
                    .post '/wx/signature', data, {skip_json_to_form: true}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR


            add_activity: (type, description) ->

                @$http
                    .post '/api/v2/user/MYSELF/add/activity',
                        _.compact {type, description, source: 'H5'}

                    .then TAKE_RESPONSE_DATA
                    .catch TAKE_RESPONSE_ERROR









    angular.module('factory').factory 'update_user_funds',

        _.ai 'user, api, $http, $q',
            ( user, api, $http, $q) -> ->

                $http.get '/api/v2/user/MYSELF/userfund'

                    .then api.TAKE_RESPONSE_DATA
                    .then (data) ->
                        _.assign user.fund, data









    angular.module('service').config _.ai '$httpProvider', ($httpProvider) ->

        $httpProvider.interceptors.push [].concat [],

            _.ai '$httpParamSerializerJQLike, api_server', ($httpParamSerializerJQLike, api_server) ->

                request: (config) ->

                    if api_server and config.url.match /// ^/ ( api | wx ) ///
                        config.url = api_server + config.url

                    {skip_json_to_form, method, headers, data} = config

                    if skip_json_to_form or method isnt 'POST' or not angular.isObject data
                        return config

                    _.set headers, 'Content-Type', 'application/x-www-form-urlencoded'
                    _.set config,  'data',         $httpParamSerializerJQLike data

                    return config
