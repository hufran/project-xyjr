
do (_, document, $script, angular, modules, APP_NAME = 'Gyro') ->

    eByID = document.getElementById.bind document

    angular.module APP_NAME, modules

        .config _.ai '$routeProvider, $locationProvider',
            (         $routeProvider, $locationProvider) ->

                $routeProvider

                    .when '/', {
                        controller: 'HomepageCtrl as self'
                        templateUrl: 'components/router/homepage/homepage.tmpl.html'
                        # redirectTo: '/list'
                    }


                    .when '/list/:type?', {
                        controller: 'ListCtrl as self'
                        templateUrl: 'components/router/list/list.tmpl.html'
                    }
#                    .when '/questions', {
#                        controller: 'QuestionCtrl as self'
#                        templateUrl: 'components/router/questions/question.tmpl.html'
#                    }


                    .when '/questions/:id', {
                        controller: 'QuestionCtrl as self'
                        templateUrl: 'components/router/questions/question.tmpl.html'
                        resolve:
                            loan: _.ai 'api, $location, $route, $q',
                                (       api, $location, $route, $q) ->
                                    api.get_loan_detail($route.current.params.id, false).catch ->
                                        $location.path '/'
                                        do $q.reject
                    }

                    .when '/appJdPay/:id', {
                        controller: 'AppJdPayCtrl as self'
                        templateUrl: 'components/router/appTransfer/appJdPay.tmpl.html'
                        resolve:
                            loan: _.ai 'api, $location, $route, $q',
                                (       api, $location, $route, $q) ->
                                    api.get_loan_detail($route.current.params.id, false).catch ->
                                        $location.path '/'
                                        do $q.reject
                    }

#                    .when '/lianPay/:id', {
#                        controller: 'LianPayCtrl as self'
#                        templateUrl: 'components/router/appTransfer/lianPay.tmpl.html'
#                        resolve:
#                            loan: _.ai 'api, $location, $route, $q',
#                                (       api, $location, $route, $q) ->
#                                    api.get_loan_detail($route.current.params.id, false).catch ->
#                                        $location.path '/'
#                                        do $q.reject
#                    }


                    .when '/login', {
                        controller: 'LoginCtrl as self'
                        templateUrl: 'components/router/login/login.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user()

                                        .then ->
                                            $location.path '/'
                                            return $q.reject()

                                        .catch $q.resolve
                    }

                    .when '/education/:category', {
                        controller: 'EducationCtrl as self'
                        templateUrl: 'components/router/appHtmls/education.tmpl.html'
                    }

                    .when '/educationRisk/:category', {
                        controller: 'EducationRiskCtrl as self'
                        templateUrl: 'components/router/appHtmls/education-risk.tmpl.html'
                    }

                    .when '/inforshow', {
                        controller: 'InfoDisclosureCtrl as self'
                        templateUrl: 'components/router/appHtmls/info-disclosure.tmpl.html'
                    }

                    .when '/platform', {
                        controller: 'PlatformintroCtrl as self'
                        templateUrl: 'components/router/appHtmls/platform-intro.tmpl.html'
                    }

                    .when '/public', {
                        controller: 'PublicnumberCtrl as self'
                        templateUrl: 'components/router/appHtmls/publicnumber.tmpl.html'
                    }

                    .when '/wchat', {
                        controller: 'WchatClientCtrl as self'
                        templateUrl: 'components/router/appHtmls/wchatclient.tmpl.html'
                    }

                    .when '/security', {
                        controller: 'MultipleSecurityCtrl as self'
                        templateUrl: 'components/router/appHtmls/multiple-security.tmpl.html'
                    }
                    .when '/register', {
                        controller: 'RegisterCtrl as self'
                        templateUrl: 'components/router/register/register.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user()

                                        .then ->
                                            $location.path '/'
                                            return $q.reject()

                                        .catch $q.resolve
                    }

                    .when '/act', {
                        controller: 'RegisterCtrlAct as self'
                        templateUrl: 'components/router/act/act.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user()

                                        .then ->
                                            $location.path '/'
                                            return $q.reject()

                                        .catch $q.resolve
                    }
                    .when '/act/success', {
                        controller: 'RegisterCtrlAct as self'
                        templateUrl: 'components/router/act/actRegSuccess.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user()

                                        .then ->
                                            $location.path '/'
                                            return $q.reject()

                                        .catch $q.resolve
                    }

                    .when '/password/forgot', {
                        controller: 'PasswordForgotCtrl as self'
                        templateUrl: 'components/router/password/password-forgot.tmpl.html'
                    }

                    .when '/password/change', {
                        controller: 'PasswordChangeCtrl as self'
                        templateUrl: 'components/router/password/password-change.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'password/change'
                                        do $q.reject
                    }

                    .when '/activity', {
                        controller: 'ActivityCtrl as self'
                        templateUrl: 'components/router/activity/activity.tmpl.html'
                    }


                    .when '/womensday', {
                        controller: 'WomensDayCtrl as self'
                        templateUrl: 'components/router/activity/womensDay.tmpl.html'
                    }

                    .when '/announcement', {
                        controller: 'AnnouncementCtrl as self'
                        templateUrl: 'components/router/announcement/announcement.tmpl.html'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.get_announcement().catch ->
                                        $location.path '/'
                                        return $q.reject()
                    }

                    .when '/help', {
                        controller: 'HelpCtrl as self'
                        templateUrl: 'components/router/help/help.tmpl.html'
                    }

                    .when '/share-coupon/:id', {
                        controller: 'ShareCouponCtrl as self'
                        templateUrl: 'components/router/share-coupon/share-coupon.tmpl.html'
                        resolve:
                            wx: _.ai 'api, $location, $route, $q, $window',
                                (     api, $location, $route, $q, $window) ->
                                    deferred = do $q.defer

                                    is_wechat = /MicroMessenger/.test $window.navigator.userAgent

                                    if is_wechat
                                        $script '//res.wx.qq.com/open/js/jweixin-1.0.0.js', ->
                                            deferred.resolve $window.wx or {}
                                    else
                                        deferred.resolve {}

                                    return deferred.promise
                    }

                    .when '/dashboard', {
                        controller: 'DashboardCtrl as self'
                        templateUrl: 'components/router/dashboard/home.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard'
                                        return $q.reject()

                            _fund: _.ai 'update_user_funds', (update_user_funds) ->
                                return update_user_funds()
                    }

                    .when '/dashboard/bank-card', {
                        controller: 'BankCardCtrl as self'
                        templateUrl: 'components/router/dashboard/bank-card.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/bank-card'
                                        do $q.reject
                    }

                    .when '/dashboard/total-assets', {
                        controller: 'TotalAssetsCtrl as self'
                        templateUrl: 'components/router/dashboard/total-assets.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/total-assets'
                                        return $q.reject()

                            _fund: _.ai 'update_user_funds', (update_user_funds) ->
                                return update_user_funds()
                    }

                    .when '/dashboard/coupon/:amount?/:months?/:loan_id?/:input?', {
                        controller: 'CouponCtrl as self'
                        templateUrl: 'components/router/dashboard/coupon.tmpl.html'
                        resolve:
                            data: _.ai 'api, $location, $q, $route',
                                (       api, $location, $q, $route) ->
                                    {amount, months, loan_id} = $route.current.params

                                    if !!amount and !!months and !!loan_id
                                        api.fetch_coupon_list(amount, months, loan_id)
                                            .then api.TAKE_RESPONSE_DATA
                                            .then (list) ->
                                                _(list)
                                                    .filter disabled: false
                                                    .pluck 'placement'
                                                    .value()
                                    else
                                        api.fetch_user_coupons()

                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/coupon'
                                        return $q.reject()
                    }

                    .when '/dashboard/notification', {
                        controller: 'NotificationCtrl as self'
                        templateUrl: 'components/router/dashboard/notification.tmpl.html'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_user_notifications().catch ->
                                        $location
                                            .replace()
                                            .path 'login'
                                            .search next: 'dashboard/notification'
                                        return $q.reject()
                    }

                    .when '/dashboard/payment/register', {
                        controller: 'PaymentPoolRegisterCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/pool/payment-pool-register.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/payment/register'
                                        return $q.reject()
                            banks: _.ai 'api', (api) -> api.payment_pool_banks()

                    }

                    .when '/dashboard/payment/agreement', {
                        controller: 'PaymentUmpAgreementCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/ump/payment-ump-agreement.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/payment/agreement'
                                        return $q.reject()
                    }

                    .when '/dashboard/payment/bind-card', {
                        controller: 'PaymentPoolBindCardCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/pool/payment-pool-bind-card.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/payment/bind-card'
                                        do $q.reject

                            banks: _.ai 'api', (api) -> api.payment_pool_banks()
                            _payment_account: _.ai 'api, $location, $route, $q',
                                (                   api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                        .then (user) ->
                                            return user if user.has_payment_account   and
                                                           user.info and
                                                           user.info.lccbUserId

                                            return $q.reject(user)

                                        .catch (user) ->
                                            return unless user
                                            if GetRequest('sourceId') != "" and  GetRequest('sourceId') != undefined

                                            else
                                                switch
                                                    when user.has_payment_account isnt true || !user.info || !user.info.lccbUserId
                                                        $location
                                                            .replace()
                                                            .path 'dashboard/payment/register'
                                                            .search
                                                                back: 'dashboard'
                                                                next: 'dashboard/payment/bind-card'

                                                    #when user.has_payment_password isnt true
                                                    #    $location
                                                    #        .replace()
                                                    #        .path 'dashboard/payment/password'
                                                    #        .search
                                                    #            back: 'dashboard'
                                                    #            next: 'dashboard/payment/bind-card'

                                                return $q.reject()
                    }

                    .when '/dashboard/payment/password/:type?', {
                        controller: 'PaymentPoolPasswordCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/pool/payment-pool-password.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q, $route',
                                (       api, $location, $q, $route) ->
                                    {type, back, next} = $route.current.params

                                    api.fetch_current_user()
                                        .then (user) ->
                                            return user if type in _.split 'set change reset'

                                            type = if user.has_payment_password then 'change' else 'set'

                                            $location
                                                .replace()
                                                .path "/dashboard/payment/password/#{ type }"
                                                .search {back, next}

                                            return $q.reject(user)

                                        .catch (user) ->
                                            unless user
                                                $location
                                                    .replace()
                                                    .path '/login'
                                                    .search next: 'dashboard/payment/password'

                                            return $q.reject()
                    }

                    .when '/dashboard/invest', {
                        controller: 'InvestCtrl as self'
                        templateUrl: 'components/router/dashboard/invest.tmpl.html'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.get_user_investments().catch ->
                                        $location.path '/dashboard'
                                        return $q.reject()
                    }

                    .when '/dashboard/invest/:id', {
                        controller: 'InvestDetailCtrl as self'
                        templateUrl: 'components/router/dashboard/invest-detail.tmpl.html'
                    }

                    .when '/dashboard/invest/:id/repayment', {
                        controller: 'RepaymentCtrl as self'
                        templateUrl: 'components/router/dashboard/repayment.tmpl.html'
                        resolve:
                            data: _.ai 'api, $location, $route',
                                (       api, $location, $route) ->
                                    api.get_repayment_detail($route.current.params.id).catch ->
                                        $location.path '/dashboard'
                                        return $q.reject()
                    }

                    .when '/dashboard/funds', {
                        controller: 'FundsCtrl as self'
                        templateUrl: 'components/router/dashboard/funds.tmpl.html'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.get_user_funds().catch ->
                                        $location.path '/dashboard'
                                        return $q.reject()

                            _fund: _.ai 'update_user_funds', (update_user_funds) ->
                                return update_user_funds()
                    }

                    .when '/dashboard/recharge', {
                        controller: 'RechargeCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/pool/payment-pool-recharge.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/recharge'
                                        do $q.reject

                            _payment_account: _.ai 'api, $location, $route, $q',
                                (                   api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                        .then (user) ->
                                            return user if user.has_payment_account and user.has_bank_card and user.info and user.info.lccbUserId
                                            return $q.reject(user)
                                        .catch (user) ->
                                            return unless user

                                            switch
                                                when user.has_payment_account isnt true || user.has_bank_card isnt true || !user.info || !user.info.lccbUserId
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/register'
                                                        .search
                                                            back: 'dashboard'
                                                            next: 'dashboard/recharge'

                                            #    when user.has_bank_card isnt true
                                            #        $location
                                            #            .replace()
                                            #            .path 'dashboard/payment/bind-card'
                                            #            .search
                                            #                back: 'dashboard'
                                            #                next: 'dashboard/recharge'

                                            return $q.reject()

                            _fund: _.ai 'update_user_funds', (update_user_funds) ->
                                return update_user_funds()
                    }

                    .when '/dashboard/withdraw', {
                        controller: 'WithdrawCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/pool/payment-pool-withdraw.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user()
                                        .catch ->
                                            $location
                                                .replace()
                                                .path '/login'
                                                .search next: 'dashboard/withdraw'
                                            return $q.reject()

                            _payment_account: _.ai 'api, $location, $route, $q',
                                (                   api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                        .then (user) ->
                                            return user if user.has_payment_account   and
                                                           user.has_payment_password  and
                                                           user.has_bank_card and user.info and 
                                                           user.info.lccbUserId

                                            return $q.reject(user)

                                        .catch (user) ->
                                            return unless user

                                            switch
                                                when user.has_payment_account isnt true || user.has_bank_card isnt true || !user.info || !user.info.lccbUserId
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/register'
                                                        .search
                                                            back: 'dashboard'
                                                            next: 'dashboard/withdraw'

                                                when user.has_payment_password isnt true
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/password'
                                                        .search
                                                            back: 'dashboard'
                                                            next: 'dashboard/withdraw'

                                                #when user.has_bank_card isnt true
                                                #    $location
                                                #        .replace()
                                                #        .path 'dashboard/payment/bind-card'
                                                #        .search
                                                #            back: 'dashboard'
                                                #            next: 'dashboard/withdraw'

                                            return $q.reject()

                            _fund: _.ai 'update_user_funds', (update_user_funds) ->
                                return update_user_funds()
                    }

                    .when '/dashboard/invite', {
                        controller: 'InviteCtrl as self'
                        templateUrl: 'components/router/dashboard/invite.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $route, $q',
                                (       api, $location, $route, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/invite'
                                        return $q.reject()

                            wx: _.ai 'api, $location, $route, $q, $window',
                                (     api, $location, $route, $q, $window) ->
                                    deferred = do $q.defer

                                    is_wechat = /MicroMessenger/.test $window.navigator.userAgent

                                    if is_wechat
                                        $script '//res.wx.qq.com/open/js/jweixin-1.0.0.js', ->
                                            deferred.resolve $window.wx or {}
                                    else
                                        deferred.resolve {}

                                    return deferred.promise
                    }

                    .when '/dashboard/invite-registered', {
                        controller: 'InviteRegisteredCtrl as self'
                        templateUrl: 'components/router/dashboard/invite-registered.tmpl.html'
                    }

                    .when '/dashboard/return-results', {
                        controller: 'ReturnResultsCtrl as self'
                        templateUrl: 'components/router/dashboard/return-results.tmpl.html'
                    }

                    .when '/loan/:id', {
                        controller: 'LoanCtrl as self'
                        templateUrl: 'components/router/loan/loan.tmpl.html'
                        resolve:
                            loan: _.ai 'api, $location, $route, $q',
                                (       api, $location, $route, $q) ->
                                    api.get_loan_detail($route.current.params.id, false).catch ->
                                        $location.path '/'
                                        do $q.reject
                    }

                    .when '/loan/:id/investors', {
                        controller: 'LoanInvestorsCtrl as self'
                        templateUrl: 'components/router/loan/loan-investors.tmpl.html'
                        resolve:
                            investors: _.ai 'api, $location, $route',
                                (       api, $location, $route) ->
                                    api.get_loan_investors($route.current.params.id).$promise.catch ->
                                        $location.path '/'
                    }

                    .when '/loan/:id/info', {
                        controller: 'LoanInfoCtrl as self'
                        templateUrl: 'components/router/loan/loan-info.tmpl.html'
                        resolve:
                            loan: _.ai 'api, $location, $route',
                                (       api, $location, $route) ->
                                    api.get_loan_detail($route.current.params.id, true).catch ->
                                        $location.path '/'
                    }

                    .when '/loan/:id/invest/:amount?/:coupon?', {
                        controller: 'LoanInvestCtrl as self'
                        templateUrl: 'components/router/loan/loan-invest.tmpl.html'
                        resolve:
                            loan: _.ai 'api, $location, $route, $q',
                                (       api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                        .then -> api.get_loan_detail($route.current.params.id, false)
                                        .catch ->
                                            $location
                                                .replace()
                                                .path '/login'
                                                .search next: "loan/#{ $route.current.params.id }/invest"
                                            return $q.reject()

                            coupon: _.ai 'api, $location, $route, $q',
                                (         api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                    .then (user) ->
                                        return api.fetch_coupon_list_select user.fund.userId

                            _payment_account: _.ai 'api, $location, $route, $q',
                                (                   api, $location, $route, $q) ->
                                    (api.fetch_current_user()

                                        .then (user) ->
                                            return user if user.has_payment_account   and
                                                           user.has_payment_password  and
                                                           user.has_bank_card and 
                                                           user.info and
                                                           user.info.lccbUserId

                                            return $q.reject(user)

                                        .catch (user) ->
                                            return unless user
                                            switch
                                                when user.has_payment_account isnt true || user.has_bank_card isnt true || !user.info || !user.info.lccbUserId
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/register'
                                                        .search
                                                            back: "loan/#{ $route.current.params.id }"
                                                            next: "loan/#{ $route.current.params.id }/invest"

                                                when user.has_payment_password isnt true
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/password'
                                                        .search
                                                            back: "loan/#{ $route.current.params.id }"
                                                            next: "loan/#{ $route.current.params.id }/invest"

                                                #when user.has_bank_card isnt true
                                                #    $location
                                                #        .replace()
                                                #        .path 'dashboard/payment/bind-card'
                                                #        .search
                                                #            back: "loan/#{ $route.current.params.id }"
                                                #            next: "loan/#{ $route.current.params.id }/invest"

                                            return $q.reject()
                                    )

                            _newbie: _.ai 'api, $location, $route, $q, $window',
                                (          api, $location, $route, $q, $window) ->
                                    is_newbie = false

                                    (api.fetch_current_user()

                                        .then (user) -> is_newbie = user.is_newbie

                                        .then -> api.get_loan_detail($route.current.params.id, true)

                                        .then (loan) ->
                                            if loan.loanRequest.productKey is 'XSZX' and is_newbie isnt true

                                                $window.alert '此为新注册用户专享产品，您不符合活动要求，请选择其他产品！'

                                                $location
                                                    .replace()
                                                    .path "loan/#{ $route.current.params.id }"

                                                return $q.reject()
                                    )

                            _fund: _.ai 'update_user_funds', (update_user_funds) ->
                                return update_user_funds()
                    }

                    .when '/protocol/:name', {
                        controller : 'ProtocolCtrl as self'
                        templateUrl : 'components/router/protocol/protocol.tmpl.html'
                    }

                    .otherwise redirectTo: '/'


                $locationProvider
                    .html5Mode true
                    .hashPrefix '!'



























        .config _.ai '$provide, build_timestamp', ($provide, build_timestamp) ->
            return unless build_timestamp

            HOLDER = '{ts}'
            TPR = 'totalPendingRequests'

            $provide.decorator '$templateRequest', _.ai '$delegate', ($delegate) ->

                wrapper = (tpl, ignoreRequestError) ->

                    if /// ^/? ( components | static | assets ) ///.test tpl
                        if not /// #{ HOLDER } ///.test tpl
                            tpl += if /\?/.test(tpl) then '&' else '?'
                            tpl += '_t=' + HOLDER

                    return $delegate tpl.replace(HOLDER, build_timestamp), ignoreRequestError

                return {}.constructor.defineProperty wrapper, TPR, get: -> $delegate[TPR]


        .config _.ai '$compileProvider', ($compileProvider) ->

            func = $compileProvider.imgSrcSanitizationWhitelist.bind $compileProvider
            list = func().source.split '|'

            list_to_append = [///
                ( wxLocalResource          # WeChat on iOS
                | weixin                   # WeChat on Android
                | chrome-extension         # Google Chrome Extensions
                | app                      # NW.js (former node-webkit)
                ):
            ///.source, list.pop()]

            func /// #{ list.concat(list_to_append).join '|' } ///i


        .run _.ai 'api, $cookies', (api, $cookies) ->
            $cookies.remove 'return_url', path: '/'

            do api.fetch_current_user


        .constant 'baseURI', document.baseURI

        .constant 'build_timestamp', do (src = eByID('main-script')?.src) ->
            1000 * (src?.match(/t=([^&]+)/)?[1] or '0')

        .constant 'api_server', do (server = eByID('main-script').getAttribute('data-api-server')) ->
            if server.match /^{.*}$/ then '' else server

    on_ready = ->
        angular.bootstrap document, [APP_NAME], strictDi: true

    angular.element(document).ready on_ready
    document.addEventListener 'deviceready', on_ready
