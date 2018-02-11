do (angular) ->
  angular.module('controller').controller 'RechargeCtrl',

    _.ai '            @user, @api, @baseURI, @$cookies, @$location, @$scope, @$window, @$routeParams, @$uibModal, @$interval, @$q', class
      constructor: (@user, @api, @baseURI, @$cookies, @$location, @$scope, @$window, @$routeParams, @$uibModal, @$interval, @$q) ->
        EXTEND_API @api
        @$window.scrollTo 0, 0

        @back_path = @$routeParams.back
        @next_path = @$routeParams.next
#        @pay_type = 'lianlianPay'    #连连支付
        @pay_type = 'depository'     #银行存管

        @$scope.bank_account = _.clone @user.bank_account


        angular.extend @$scope, {
          bank_account: _.clone @user.bank_account
          available_amount: @user.fund.availableAmount
#                    return_url: @baseURI + 'dashboard'

          return_url: 'http://www.718bank.com/h5/dashboard/funds'
          action1: '/api/v2/jdpay/onlineBankDeposit4Wap/' + @user.fund.userId
          action2: '/api/v2/lianlianpay/deposit/' + @user.fund.userId
          token: @$cookies.get 'ccat'
        }
        if  @pay_type == 'lianlianPay'
          @$scope.action = @$scope.action2
        else if @pay_type == 'depository'
          @$scope.action = ""
        else
          @$scope.action = @$scope.action1
        if +@$routeParams.amount > 0
          @$scope.amount = @$routeParams.amount // 100 * 100 + 100

        @api.payment_pool_banks().then (data) =>
          @$scope.bank_account.bank = data[@$scope.bank_account.bank]

        @api.payment_pool_bank_limit(@$scope.bank_account.bank).then (data)=>
          @$scope.limit=data.data
        

      modify_amonut: ->

#                console.log Number( (@$scope.amount*100 ).toFixed(0) )
        if  @pay_type == 'lianlianPay'
          @$scope.amountNew = filterXSS(@$scope.amount.toString())
        else
          @$scope.amountNew = filterXSS((Math.round(@$scope.amount)).toString())


      submit: (event, amount, return_url) ->

        if parseFloat(amount) <=0
          @$window.alert "充值金额不能小于0"
          return 
        return unless !!amount
        (@api.payment_pool_lccb_faster @user.info.id,amount,@$scope.return_url
          .then (data) =>
            return @$q.reject(data) unless data.status is 0
            return data
          .then (data) =>
            @$window.form.action=data.data
            do @$window.form.submit
          .catch (data) =>
            @$window.alert data.msg
        )



  EXTEND_API = (api) ->
    api.__proto__.payment_get_recharge_url = (amount, retUrl, isWAP = true) ->
      @$http
      .post '/api/v2/yeepay/wapBankDeposit/MYSELF',
        {amount, retUrl, isWAP}

      .then @TAKE_RESPONSE_DATA
      .catch @TAKE_RESPONSE_ERROR
