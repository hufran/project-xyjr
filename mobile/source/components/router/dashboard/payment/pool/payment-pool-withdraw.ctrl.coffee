
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
                


                @api.get_available_bank_list().then (data) =>
                    data["CIB"]="兴业银行";
                    data["CMBC"]="中国民生银行";
                    data["ABC"]="中国农业银行";
                    @$scope.bank_account.bank = data[@$scope.bank_account.bank]


            submit: (amount = @$scope.amount or 0, password) ->
                @amount = filterXSS(amount.toString())
                @password = filterXSS(password)
                @submit_sending = true


                do @paymentPoint.bind @


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

                          return unless !!phonenumber and !!cardnbr

                          
                          transtype='800003'
                          
                          (self.api.payment_pool_send_captcha(self.user.info.id,transtype,phonenumber,cardnbr)

                            .then (data) =>
                                return self.$q.reject(data) unless data.status is 1
                                return data

                            .then (data) =>
                                console.log data
                                status=_.get data,'status'
                                if status!=1
                                  self.smsid=data.data
                                  timer = self.$interval =>
                                    $scope.cell_buffering_count -= 1
                                    
                                    if $scope.cell_buffering_count < 1
                                        self.$interval.cancel timer
                                        $scope.cell_buffering_count += 1000 * ($scope.cell_buffering_count % 1)
                                        $scope.cell_buffering = false
                                        
                                  , 1000
                                  $scope.cell_buffering = true
                                else
                                  self.mg_alert "发送短信失败,"+data.msg
                                  $scope.cell_buffering = false
                                
                                $scope.mobile_verification_code_has_sent = false

                            .catch (data) =>

                                key = _.get data, 'msg'
                                self.mg_alert "短信发送失败,"+key
                                $scope.mobile_verification_code_has_sent = false
                            
                          )
                      }

                      
                      
                }
                payment.result.catch (mobile_captcha) =>
                  console.log "@amount:",@amount," password:",@password," mobile_captcha:",mobile_captcha

                  if typeof mobile_captcha =="undefined" || mobile_captcha==null || !(/^\d{6}$/.test mobile_captcha)
                    @mg_alert "验证码不正确!"
                    return false
                  
                  if !@amount||parseInt @amount <=0
                    @mg_alert "请填写提现金额!"
                    return false

                  if !@password 
                    @mg_alert "请填写密码！"
                    return false
                  if !@smsid
                    @mg_alert "请发送短信后在操作！"
                  if !@user.bank_account || !@user.bank_account.bank || !@user.bank_account.account || !@user.bank_account.account
                    @mg_alert "您尚未开通存管，请开通后在操作"
                    @$window.location.href="/dashboard/payment/register"
                    return

                  return unless !!mobile_captcha and !!@smsid and !!@amount and !!@password and !!@user.bank_account and !!@user.bank_account.bank

                  (@api.payment_pool_check_password(@password)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
                        return data

                    .catch (data) =>
                        @$q.reject error: [message: 'INCORRECT_PASSWORD']


                    .then (data) => @api.payment_pool_custody_withdraw(@amount, @password, @smsid, mobile_captcha)

                    .then (data) =>
                        return @$q.reject(data) unless data.success is true
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
                        key = _.get data, 'error[0].message'
                        @mg_alert @$scope.msg[key] or key

                    .finally =>
                        42
                )

