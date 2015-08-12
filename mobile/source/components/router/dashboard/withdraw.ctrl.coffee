
do (angular) ->

    angular.module('controller').controller 'WithdrawCtrl',

        _.ai '            @user, @api, @cookie2root, @$location, @$scope, @$window, @$q, @$modal', class
            constructor: (@user, @api, @cookie2root, @$location, @$scope, @$window, @$q, @$modal) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    available_amount: @user.fund.availableAmount
                    total_amount: @user.fund.availableAmount + @user.fund.frozenAmount

                    bank_list: do (list = @user.bank_account_list) =>
                        return _.filter list, 'expressAccount' if @user.has_bank_card_express
                        return list
                }


            open_payment_account: ($event) ->

                @cookie2root 'return_url', 'dashboard/withdraw'


            submit: ($event, amount = @$scope.amount or 0) ->

                @cookie2root 'return_url', 'dashboard/funds'


            prompt_bind_card: ->

                prompt = @$modal.open {
                    size: 'sm'
                    keyboard: false
                    backdrop: 'static'
                    windowClass: 'center modal-confirm'
                    animation: true
                    templateUrl: 'ngt-withdraw-bind-card.tmpl'
                }

                prompt.result.catch () =>
                    @$window.location.reload()


