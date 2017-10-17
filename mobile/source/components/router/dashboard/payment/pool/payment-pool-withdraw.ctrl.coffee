
do (angular) ->

    angular.module('controller').controller 'WithdrawCtrl',

        _.ai '            @user, @api, @$location, @$scope, @$window, @$q, @mg_alert, @$uibModal, @$interval', class
            constructor: (@user, @api, @$location, @$scope, @$window, @$q, @mg_alert, @$uibModal, @$interval) ->

                @$window.scrollTo 0, 0

                angular.extend @$scope, {
                    bank_account: _.clone @user.bank_account
                    available_amount: @user.fund.availableAmount
                    total_amount: @user.fund.availableAmount + @user.fund.frozenAmount
                }

                @submit_sending = false
                


                @api.payment_pool_banks().then (data) =>
                    @$scope.bank_account.bank = data[@$scope.bank_account.bank]


            submit: (amount = @$scope.amount or 0, password) ->
                @amount = filterXSS(amount.toString())
                @password = filterXSS(password)
                @submit_sending = true

                if !@amount||parseInt @amount <=0
                      @mg_alert "请填写提现金额!"
                      return false
                if !@password 
                  @mg_alert "请填写密码！"
                  return false
                if !@user.info || !@user.info.lccbUserId
                  @mg_alert "您尚未开通存管，请开通后在操作"
                  $location
                    .replace()
                    .path "dashboard/payment/register"
                  return
                return unless !!@amount and !!@password and !!@user.info and !!@user.info.lccbUserId

                (@api.payment_pool_check_password(@password)

                  .then (data) =>
                      return @$q.reject(data) unless data.success is true
                      return data
                  .then (data) =>
                      do @paymentPoint.bind @
                  .catch (data) =>
                      @submit_sending = false
                      @mg_alert "交易密码不正确！"
                )             

            paymentPoint:()->
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
                        send_verification_code: () ->
                          $scope.mobile_verification_code_has_sent = true
                          if self.timer
                            self.$interval.cancel self.timer
                            self.timer=null
                            $scope.cell_buffering_count =120.119
                            $scope.cell_buffering = false

                          if !self.user.bank_account||!self.user.bank_account.bankMobile
                              self.mg_alert '您需要开通银行存管才可操作！'
                              self.$location
                                  .replace()
                                  .path "dashboard/payment/register"
                              return
                          else
                              phonenumber=filterXSS self.user.bank_account.bankMobile

                          if !self.user.bank_account||!self.user.bank_account.account
                              self.mg_alert '您需要开通银行存管才可操作！'
                              self.$location
                                  .replace()
                                  .path "dashboard/payment/register"
                              return
                          else
                              cardnbr=filterXSS self.user.bank_account.account

                          if !self.user.bank_account||!self.user.bank_account.name
                              self.mg_alert '您需要开通银行存管才可操作！'
                              self.$location
                                  .replace()
                                  .path "dashboard/payment/register"
                              return
                          else 
                              username=filterXSS self.user.bank_account.name

                          return unless !!phonenumber and !!cardnbr and !!username

                          
                          transtype='800003'
                          
                          (self.api.payment_pool_send_captcha(self.user.info.id,transtype,phonenumber,cardnbr,username)

                            .then (data) =>
                                $scope.cell_buffering=false
                                return self.$q.reject(data) unless data.status is 0
                                return data

                            .then (data) =>
                                
                                self.smsid=data.data
                                self.timer = self.$interval =>
                                  $scope.cell_buffering_count -= 1
                                  
                                  if $scope.cell_buffering_count < 1
                                      self.$interval.cancel self.timer
                                      self.timer=null
                                      self.smsid=null
                                      $scope.cell_buffering_count += 1000 * ($scope.cell_buffering_count % 1)
                                      $scope.cell_buffering = false
                                      
                                , 1000
                                $scope.cell_buffering = true
                                $scope.mobile_verification_code_has_sent = false

                            .catch (data) =>

                                key = _.get data, 'msg'
                                self.mg_alert "短信发送失败,"+key
                                $scope.mobile_verification_code_has_sent = false
                            
                          )
                      }

                      $scope.cell_buffering=true
                      do $scope.send_verification_code
                      
                }
                payment.result.then () =>
                    @submit_sending = false
                payment.result.catch (mobile_captcha) =>
                    console.log "@amount:",@amount," password:",@password," mobile_captcha:",mobile_captcha
                    if typeof mobile_captcha =="undefined" || mobile_captcha==null || !(/^\d{6}$/.test mobile_captcha)
                      @mg_alert "验证码不正确!"
                      return false
                    
                    if !@smsid
                      @mg_alert "请发送短信后在操作！"

                    return unless !!mobile_captcha and !!@smsid

                    (@api.payment_pool_custody_withdraw(@amount, @password, @smsid, mobile_captcha)

                      .then (data) =>
                          return @$q.reject(data) unless data.status is 0
                          return data

                      .then (data) =>
                          @mg_alert @$scope.msg.SUCCEED
                              .result.finally =>
                                  @$location.path 'dashboard'

                          @$scope.$on '$locationChangeStart', (event, new_path) =>
                              event.preventDefault()
                              @$window.location = new_path
                          

                      .catch (data) =>
                          @submit_sending = false
                          #key = _.get data, 'error[0].message'|| _.get data, 'msg'
                          console.log "data:",data
                          @mg_alert _.get data, 'msg'
                      .finally =>
                          42
                    )
                  