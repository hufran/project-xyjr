
do (angular) ->

    angular.module('controller').controller 'RechargeCtrl',

        _.ai '            @user, @api, @baseURI, @$cookies, @$location, @$scope, @$window, @$routeParams', class
            constructor: (@user, @api, @baseURI, @$cookies, @$location, @$scope, @$window, @$routeParams) ->

                EXTEND_API @api
                @$window.scrollTo 0, 0

                @back_path = @$routeParams.back
                @next_path = @$routeParams.next

                @$scope.bank_account = _.clone @user.bank_account

                angular.extend @$scope, {
                    bank_account: _.clone @user.bank_account
                    available_amount: @user.fund.availableAmount
                    return_url: @baseURI + 'dashboard'
                    action1:'/api/v2/jdpay/onlineBankDeposit4Wap/'+@user.fund.userId
                    token:@$cookies.get 'ccat'

                }

                if +@$routeParams.amount > 0
                    @$scope.amount = @$routeParams.amount // 100 * 100 + 100

                @api.get_available_bank_list().then (data) =>
                    @$scope.bank_account.bank = data[@$scope.bank_account.bank]




            modify_amonut:  ->

                @$scope.amountNew = parseInt(@$scope.amount*100);


            submit: (event, amount, return_url) ->

                @api.payment_get_recharge_url amount, return_url
                    .then (data) =>
                        @$window.location.href = data.message









    EXTEND_API = (api) ->

        api.__proto__.payment_get_recharge_url = (amount, retUrl, isWAP = true) ->

            @$http
                .post '/api/v2/yeepay/wapBankDeposit/MYSELF',
                    {amount, retUrl, isWAP}

                .then @TAKE_RESPONSE_DATA
                .catch @TAKE_RESPONSE_ERROR
