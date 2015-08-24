
do (_, document, angular, modules, APP_NAME = 'Gyro') ->

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

                    .when '/login', {
                        controller: 'LoginCtrl as self'
                        templateUrl: 'components/router/login/login.tmpl.html'
                    }

                    .when '/register', {
                        controller: 'RegisterCtrl as self'
                        templateUrl: 'components/router/register/register.tmpl.html'
                    }

                    .when '/password', {
                        controller: 'PasswordCtrl as self'
                        templateUrl: 'components/router/password/password.tmpl.html'
                    }

                    .when '/about', {
                        controller: 'AboutCtrl as self'
                        templateUrl: 'components/router/about/about.tmpl.html'
                    }

                    .when '/safety', {
                        controller: 'SafetyCtrl as self'
                        templateUrl: 'components/router/safety/safety.tmpl.html'
                    }

                    .when '/help', {
                        controller: 'HelpCtrl as self'
                        templateUrl: 'components/router/help/help.tmpl.html'
                    }

                    .when '/announcement', {
                        controller: 'AnnouncementCtrl as self'
                        templateUrl: 'components/router/announcement/announcement.tmpl.html'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.get_announcement().catch ->
                                        $location.path '/'
                                        do $q.reject
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
                                        do $q.reject
                    }

                    .when '/dashboard/coupon', {
                        controller: 'CouponCtrl as self'
                        templateUrl: 'components/router/dashboard/coupon.tmpl.html'
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
                        controller: 'PaymentUmpRegisterCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/ump/payment-ump-register.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/payment/register'
                                        do $q.reject
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
                                        do $q.reject
                    }

                    .when '/dashboard/payment/bind-card', {
                        controller: 'PaymentUmpBindCardCtrl as self'
                        templateUrl: 'components/router/dashboard/payment/ump/payment-ump-bind-card.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/payment/bind-card'
                                        do $q.reject
                    }

                    .when '/dashboard/invest', {
                        controller: 'InvestCtrl as self'
                        templateUrl: 'components/router/dashboard/invest.tmpl.html'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.get_user_investments().catch ->
                                        $location.path '/dashboard'
                                        do $q.reject
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
                    }

                    .when '/dashboard/funds', {
                        controller: 'FundsCtrl as self'
                        templateUrl: 'components/router/dashboard/funds.tmpl.html'
                        resolve:
                            data: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.get_user_funds().catch ->
                                        $location.path '/dashboard'
                                        do $q.reject
                    }

                    .when '/dashboard/recharge', {
                        controller: 'RechargeCtrl as self'
                        templateUrl: 'components/router/dashboard/recharge.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/recharge'
                                        do $q.reject
                    }

                    .when '/dashboard/withdraw', {
                        controller: 'WithdrawCtrl as self'
                        templateUrl: 'components/router/dashboard/withdraw.tmpl.html'
                        resolve:
                            user: _.ai 'api, $location, $q',
                                (       api, $location, $q) ->
                                    api.fetch_current_user().catch ->
                                        $location
                                            .replace()
                                            .path '/login'
                                            .search next: 'dashboard/withdraw'
                                        do $q.reject
                    }

                    .when '/dashboard/invite', {
                        controller: 'InviteCtrl as self'
                        templateUrl: 'components/router/dashboard/invite.tmpl.html'
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
                        templateUrl: 'components/router/dashboard/return-results.tmpl.html'
                    }

                    .when '/loan/:id', {
                        controller: 'LoanCtrl as self'
                        templateUrl: 'components/router/loan/loan.tmpl.html'
                        resolve:
                            loan: _.ai 'api, $location, $route',
                                (       api, $location, $route) ->
                                    api.get_loan_detail($route.current.params.id, true).catch ->
                                        $location.path '/'
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

                    .when '/loan/:id/invest', {
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
                                            do $q.reject

                            coupon: _.ai 'api, $location, $route, $q',
                                (         api, $location, $route, $q) ->
                                    api.fetch_current_user()
                                        .then -> api.get_loan_detail($route.current.params.id, true)
                                        .then (data) -> data.loan
                                        .then (data) ->
                                            amount = 999999999
                                            months = _.get data, 'duration.totalMonths'

                                            return api.fetch_coupon_list amount, months
                    }

                    .when '/loan/:id/invest/return', {
                        controller: 'LoanInvestReturnCtrl as self'
                        templateUrl: 'components/router/loan/loan-invest-return.tmpl.html'
                    }

                    .otherwise redirectTo: '/'


                $locationProvider
                    .html5Mode true
                    .hashPrefix '!'


        .run _.ai 'api, cookie2root', (api, cookie2root) ->
            cookie2root 'return_url', '', ''
            do api.fetch_current_user


        .constant 'baseURI', document.baseURI



    angular.element(document).ready ->
        angular.bootstrap document, [APP_NAME]
