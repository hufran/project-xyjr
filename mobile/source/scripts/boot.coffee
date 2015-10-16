
do (_, document, angular, modules, APP_NAME = 'Gyro') ->

    angular.module APP_NAME, modules

        .config _.ai '$routeProvider, $locationProvider',
            (         $routeProvider, $locationProvider) ->

                $routeProvider

                    .when '/', {
                        controller: 'HomepageCtrl as self'
                        templateUrl: 'components/router/homepage/homepage.tmpl.html?t={ts}'
                        # redirectTo: '/list'
                    }

                    .when '/list/:type?', {
                        controller: 'ListCtrl as self'
                        templateUrl: 'components/router/list/list.tmpl.html?t={ts}'
                    }

                    .when '/login', {
                        controller: 'LoginCtrl as self'
                        templateUrl: 'components/router/login/login.tmpl.html?t={ts}'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user()

                                        .then ->
                                            $location.path '/'
                                            do $q.reject

                                        .catch $q.resolve
                    }

                    .when '/register', {
                        controller: 'RegisterCtrl as self'
                        templateUrl: 'components/router/register/register.tmpl.html?t={ts}'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user()

                                        .then ->
                                            $location.path '/'
                                            do $q.reject

                                        .catch $q.resolve
                    }

                    .when '/password', {
                        controller: 'PasswordCtrl as self'
                        templateUrl: 'components/router/password/password.tmpl.html?t={ts}'
                    }

                    .when '/activity', {
                        controller: 'ActivityCtrl as self'
                        templateUrl: 'components/router/activity/activity.tmpl.html?t={ts}'
                    }

                    .when '/announcement', {
                        controller: 'AnnouncementCtrl as self'
                        templateUrl: 'components/router/announcement/announcement.tmpl.html?t={ts}'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.get_announcement().catch ->
                                        $location.path '/'
                                        do $q.reject
                    }

                    .when '/dashboard', {
                        controller: 'DashboardCtrl as self'
                        templateUrl: 'components/router/dashboard/home.tmpl.html?t={ts}'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard'
                                        do $q.reject

                            _payment_account: _.ai 'api, $location, $route, $q',
                                (                   api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                        .then (user) ->
                                            return user if user.has_payment_account
                                            return $q.reject(user)
                                        .catch (user) ->
                                            return unless user

                                            switch
                                                when user.has_payment_account isnt true
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/register'
                                                        .search
                                                            back: '/'
                                                            next: 'dashboard'
                    }

                    .when '/dashboard/bank-card', {
                        controller: 'BankCardCtrl as self'
                        templateUrl: 'components/router/dashboard/bank-card.tmpl.html?t={ts}'
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
                        templateUrl: 'components/router/dashboard/total-assets.tmpl.html?t={ts}'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/total-assets'
                                        do $q.reject
                    }

                    .when '/dashboard/coupon', {
                        controller: 'CouponCtrl as self'
                        templateUrl: 'components/router/dashboard/coupon.tmpl.html?t={ts}'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_user_coupons().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/coupon'
                                        do $q.reject
                    }

                    .when '/dashboard/payment/register', {
                        controller: 'PaymentPoolRegisterCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/pool/payment-pool-register.tmpl.html?t={ts}'
                        _resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/payment/register'
                                        do $q.reject
                    }

                    .when '/dashboard/payment/password', {
                        controller: 'PaymentPoolPasswordCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/pool/payment-pool-password.tmpl.html?t={ts}'
                        _resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/payment/password'
                                        do $q.reject
                    }

                    .when '/dashboard/payment/agreement', {
                        controller: 'PaymentUmpAgreementCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/ump/payment-ump-agreement.tmpl.html?t={ts}'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/payment/agreement'
                                        do $q.reject
                    }

                    .when '/dashboard/payment/bind-card', {
                        controller: 'PaymentPoolBindCardCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/pool/payment-pool-bind-card.tmpl.html?t={ts}'
                        resolve:
                            banks: _.ai 'api', (api) -> api.get_available_bank_list()

                            _payment_bank_account: _.ai 'api, $location, $route, $q',
                                (                        api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                        .then (user) ->
                                            return user if user.has_payment_account
                                            return $q.reject(user)
                                        .catch (user) ->
                                            return unless user

                                            switch
                                                when user.has_payment_account isnt true
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/register'
                                                        .search
                                                            back: 'dashboard'
                                                            next: 'dashboard/payment/bind-card'
                    }

                    .when '/dashboard/invest', {
                        controller: 'InvestCtrl as self'
                        templateUrl: 'components/router/dashboard/invest.tmpl.html?t={ts}'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.get_user_investments().catch ->
                                        $location.path '/dashboard'
                                        do $q.reject
                    }

                    .when '/dashboard/invest/:id', {
                        controller: 'InvestDetailCtrl as self'
                        templateUrl: 'components/router/dashboard/invest-detail.tmpl.html?t={ts}'
                    }

                    .when '/dashboard/invest/:id/repayment', {
                        controller: 'RepaymentCtrl as self'
                        templateUrl: 'components/router/dashboard/repayment.tmpl.html?t={ts}'
                        resolve:
                            data: _.ai 'api, $location, $route',
                                (       api, $location, $route) ->
                                    api.get_repayment_detail($route.current.params.id).catch ->
                                        $location.path '/dashboard'
                    }

                    .when '/dashboard/funds', {
                        controller: 'FundsCtrl as self'
                        templateUrl: 'components/router/dashboard/funds.tmpl.html?t={ts}'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.get_user_funds().catch ->
                                        $location.path '/dashboard'
                                        do $q.reject
                    }

                    .when '/dashboard/recharge', {
                        controller: 'RechargeCtrl as self'
                        templateUrl: 'components/router/dashboard/recharge.tmpl.html?t={ts}'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/recharge'
                                        do $q.reject

                            _payment_bank_account: _.ai 'api, $location, $route, $q',
                                (                        api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                        .then (user) ->
                                            return user if user.has_payment_account and user.has_bank_card
                                            return $q.reject(user)
                                        .catch (user) ->
                                            return unless user

                                            switch
                                                when user.has_payment_account isnt true
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/register'
                                                        .search
                                                            back: 'dashboard'
                                                            next: 'dashboard/recharge'

                                                when user.has_bank_card isnt true
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/bind-card'
                                                        .search
                                                            back: 'dashboard'
                                                            next: 'dashboard/recharge'
                    }

                    .when '/dashboard/withdraw', {
                        controller: 'WithdrawCtrl as self'
                        templateUrl: 'components/router/dashboard/withdraw.tmpl.html?t={ts}'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/withdraw'
                                        do $q.reject

                            _payment_account: _.ai 'api, $location, $route, $q',
                                (                   api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                        .then (user) ->
                                            return user if user.has_payment_account and user.has_bank_card
                                            return $q.reject(user)
                                        .catch (user) ->
                                            return unless user

                                            switch
                                                when user.has_payment_account isnt true
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/register'
                                                        .search
                                                            back: 'dashboard'
                                                            next: 'dashboard/withdraw'

                                                when user.has_bank_card isnt true
                                                    $location
                                                        .replace()
                                                        .path 'dashboard/payment/bind-card'
                                                        .search
                                                            back: 'dashboard'
                                                            next: 'dashboard/withdraw'
                    }

                    .when '/dashboard/invite', {
                        controller: 'InviteCtrl as self'
                        templateUrl: 'components/router/dashboard/invite.tmpl.html?t={ts}'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/invite'
                                        do $q.reject
                    }

                    .when '/dashboard/return-results', {
                        controller: 'ReturnResultsCtrl as self'
                        templateUrl: 'components/router/dashboard/return-results.tmpl.html?t={ts}'
                    }

                    .when '/loan/:id', {
                        controller: 'LoanCtrl as self'
                        templateUrl: 'components/router/loan/loan.tmpl.html?t={ts}'
                        resolve:
                            loan: _.ai 'api, $location, $route',
                                (       api, $location, $route) ->
                                    api.get_loan_detail($route.current.params.id, true).catch ->
                                        $location.path '/'
                    }

                    .when '/loan/:id/investors', {
                        controller: 'LoanInvestorsCtrl as self'
                        templateUrl: 'components/router/loan/loan-investors.tmpl.html?t={ts}'
                        resolve:
                            investors: _.ai 'api, $location, $route',
                                (       api, $location, $route) ->
                                    api.get_loan_investors($route.current.params.id).$promise.catch ->
                                        $location.path '/'
                    }

                    .when '/loan/:id/info', {
                        controller: 'LoanInfoCtrl as self'
                        templateUrl: 'components/router/loan/loan-info.tmpl.html?t={ts}'
                        resolve:
                            loan: _.ai 'api, $location, $route',
                                (       api, $location, $route) ->
                                    api.get_loan_detail($route.current.params.id, true).catch ->
                                        $location.path '/'
                    }

                    .when '/loan/:id/invest', {
                        controller: 'LoanInvestCtrl as self'
                        templateUrl: 'components/router/loan/loan-invest.tmpl.html?t={ts}'
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
                                            do $q.reject

                            coupon: _.ai 'api, $location, $route, $q',
                                (         api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                        .then -> api.get_loan_detail($route.current.params.id, true)
                                        .then (data) ->
                                            amount = 999999999
                                            months = _.get data, 'duration.totalMonths'

                                            return api.fetch_coupon_list amount, months

                            _payment_account: _.ai 'api, $location, $route, $q',
                                (                   api, $location, $route, $q) ->
                                    (api.fetch_current_user()

                                        .then (user) ->
                                            return user if user.has_payment_account and user.has_payment_password
                                            return $q.reject(user)

                                        .catch (user) ->
                                            return unless user

                                            switch
                                                when user.has_payment_account isnt true
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
                                                            back: 'dashboard'
                                                            next: "loan/#{ $route.current.params.id }/invest"
                                    )
                    }

                    .when '/loan/:id/invest/return', {
                        controller: 'LoanInvestReturnCtrl as self'
                        templateUrl: 'components/router/loan/loan-invest-return.tmpl.html?t={ts}'
                    }

                    .otherwise redirectTo: '/'


                $locationProvider
                    .html5Mode true
                    .hashPrefix '!'


        .config _.ai '$provide, build_timestamp', ($provide, build_timestamp) ->
            return unless build_timestamp

            HOLDER = '{ts}'

            $provide.decorator '$templateRequest', _.ai '$delegate', ($delegate) ->

                (tpl, ignoreRequestError) ->

                    if /// ^/? ( components | static | assets ) ///.test tpl
                        if not /// #{ HOLDER } ///.test tpl
                            tpl += if /\?/.test(tpl) then '&' else '?'
                            tpl += '_t=' + HOLDER

                    $delegate tpl.replace(HOLDER, build_timestamp), ignoreRequestError


        .run _.ai 'api, cookie2root', (api, cookie2root) ->
            cookie2root 'return_url', '', ''
            do api.fetch_current_user


        .constant 'baseURI', document.baseURI

        .constant 'build_timestamp', do (src = document.getElementById('main-script')?.src) ->
            +(src.match(/t=([^&]+)/)?[1] or '0')


    angular.element(document).ready ->
        angular.bootstrap document, [APP_NAME], strictDi: true
