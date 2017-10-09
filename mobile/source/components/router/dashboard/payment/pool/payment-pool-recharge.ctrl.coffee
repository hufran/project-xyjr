do (angular) ->
  angular.module('controller').controller 'RechargeCtrl',

    _.ai '            @user, @api, @baseURI, @$cookies, @$location, @$scope, @$window, @$routeParams', class
      constructor: (@user, @api, @baseURI, @$cookies, @$location, @$scope, @$window, @$routeParams) ->
        EXTEND_API @api
        @$window.scrollTo 0, 0

        @back_path = @$routeParams.back
        @next_path = @$routeParams.next
        @pay_type = 'lianlianPay'

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
        @api.payment_get_recharge_url amount, return_url
        .then (data) =>
          @$window.location.href = data.message

      paymentPoint:(amount)->
        payment=@$uibModal.open {
            size: 'sm'
            keyboard: false
            backdrop: 'static'
            windowClass: 'center ngt-share-coupon'
            animation: true
            templateUrl: 'ngt-pool-recharge.tmpl'
            controller: _.ai '$scope', ($scope) =>
                self=@
                angular.extend $scope, {
                  bankNumber:@user.bank_account.bankMobile.substring(0,3)+"****"+@user.bank_account.bankMobile.substring(7),
                  cell_buffering_count:120.119,
                  cell_buffering:false,
                  mobile_verification_code_has_sent:true,
                  amount:amount,
                  send_verification_code: () ->
                      $scope.mobile_verification_code_has_sent = true
                      if !self.user.bank_account||!self.user.bank_account.bankMobile
                          self.$window.alert '您需要开通银行存管才可操作！'
                          self.$location
                              .replace()
                              .path "dashboard/payment/register"
                          return
                      else
                          phonenumber=filterXSS self.user.bank_account.bankMobile

                      if !self.user.bank_account||!self.user.bank_account.account
                          self.$window.alert '您需要开通银行存管才可操作！'
                          self.$location
                              .replace()
                              .path "dashboard/payment/register"
                          return
                      else
                          cardnbr=filterXSS self.user.bank_account.account

                      if !self.user.bank_account||!self.user.bank_account.name
                          self.$window.alert '您需要开通银行存管才可操作！'
                          self.$location
                              .replace()
                              .path "dashboard/payment/register"
                          return
                      else 
                          username=filterXSS self.user.bank_account.name
                          
                      return unless !!phonenumber and !!cardnbr and !!username

                      
                      transtype='800002'
                      
                      (self.api.payment_pool_send_captcha(self.user.info.id,transtype,phonenumber,cardnbr,username)

                        .then (data) =>
                            $scope.cell_buffering=false
                            return self.$q.reject(data) unless data.status is 0
                            return data

                        .then (data) =>
                            self.smsid=data.data
                            timer = self.$interval =>
                              $scope.cell_buffering_count -= 1
                              
                              if $scope.cell_buffering_count < 1
                                  self.$interval.cancel timer
                                  console.log "$scope.cell_buffering_count:",$scope.cell_buffering_count%1
                                  $scope.cell_buffering_count += 1000 * ($scope.cell_buffering_count % 1)
                                  $scope.cell_buffering = false

                            , 1000
                            $scope.cell_buffering = true
                            $scope.mobile_verification_code_has_sent = false

                        .catch (data) =>
                            key = _.get data, 'msg'
                            self.$window.alert "短信发送失败,"+key

                            $scope.mobile_verification_code_has_sent = false
                      )
                }
                $scope.cell_buffering=true
                do $scope.send_verification_code

        }

        payment.result.catch ({amount, mobile_captcha}) =>
          @$scope.rechargeResult=0
          if typeof amount=="undefined"||!amount
            @$scope.rechargeResult=1
            @$window.alert "请填写充值金额！"
            return
          else
            amount=filterXSS amount.toString()
            @$scope.rechargeResult=0
          if typeof mobile_captcha =="undefined" || mobile_captcha==null || !(/^\d{6}$/.test mobile_captcha)
            @$scope.rechargeResult=1
            @$window.alert "请填写验证码！"
            return
          else
            @$scope.rechargeResult=0
            mobile_captcha=filterXSS mobile_captcha
          if !@smsid
            @$scope.rechargeResult=1
            #@$window.alert "请发送验证码后操作！"
            @paymentPoint amount
            return
          if !@user.bank_account || !@user.bank_account.bank || !@user.bank_account.account || !@user.bank_account.account
            @$scope.rechargeResult=1
            @$window.alert "您尚未开通存管，请开通后在操作"
            @$window.location.href="/dashboard/payment/register"
            return

          return unless !!mobile_captcha and !!@smsid and !!amount
          @$scope.rechargeResult=0
          @api.payment_pool_recharge(@user.info.id, @user.bank_account.bank, @user.bank_account.account, amount, @smsid, mobile_captcha)

            .then (data) =>
              return @$q.reject(data) unless data.status is 0
              return data

            .then (data) =>
                @$scope.rechargeResult=0
                @smsid=null
                @$window.alert "充值成功！"
                @$window.location.href="/dashboard"
            .catch (data) =>
              @$scope.rechargeResult=1
              @smsid=null
              @$window.alert "充值失败,"+data.msg
          return


  EXTEND_API = (api) ->
    api.__proto__.payment_get_recharge_url = (amount, retUrl, isWAP = true) ->
      @$http
      .post '/api/v2/yeepay/wapBankDeposit/MYSELF',
        {amount, retUrl, isWAP}

      .then @TAKE_RESPONSE_DATA
      .catch @TAKE_RESPONSE_ERROR
