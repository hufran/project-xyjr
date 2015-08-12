
do (_, angular) ->

    angular.module('service').service 'user',

        _.ai '            @$rootScope', class
            constructor: (@$rootScope) ->

                @info = null
                @fund = null
                @payment = null
                @agreement = null
                @fund_accounts = null

                @has_logged_in = false
                @has_bank_card = false
                @has_bank_card_express = false
                @has_payment_account = false
                @has_instant_invest = false
                @has_nonpwd_netsave = false

                @bank_account = {}
                @bank_account_list = []


            ready: (status = false) ->

                return unless status is true

                _.split('info fund payment agreement fund_accounts').forEach (property) =>
                    @[property] ?= {}

                @has_logged_in = true

                @has_payment_account = !!@payment?.accountId
                @has_instant_invest = !!@agreement?.invest

                @has_nonpwd_netsave = do ({instant, debit} = @agreement) ->
                    instant is debit is true

                @bank_account_list = do (list = _(@fund_accounts or [])) ->
                    list.each (item) ->
                            item.account.mask =
                                "#{ item.account.account }".replace /^(\d{4})(\d+)(\d{4})$/, '$1 ***** ***** $3'
                        .value()

                @bank_account = _(@bank_account_list).pluck('account').first()

                @has_bank_card = !!@bank_account?.account
                @has_bank_card_express = _.some @bank_account_list, 'expressAccount'

                @$rootScope.$broadcast 'user.logged_in', @

                return @
