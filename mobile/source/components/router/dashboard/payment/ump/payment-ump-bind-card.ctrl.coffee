
do (_, angular) ->

    angular.module('controller').controller 'PaymentUmpBindCardCtrl',

        _.ai             '@user, @baseURI, @cookie2root, @$scope, @$window', class
            constructor: (@user, @baseURI, @cookie2root, @$scope, @$window) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    agreement: @user.agreement
                    bank_account: @user.bank_account
                }


            submit: (event) ->

                @cookie2root 'return_url', @baseURI + 'dashboard/recharge'
