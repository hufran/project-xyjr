
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
                @successUrl=@$window.location.origin+"/h5/dashboard/funds"

                @api.payment_pool_banks().then (data) =>
                    @$scope.bank_account.bank = data[@$scope.bank_account.bank]


            submit: (event,amount = @$scope.amount or 0) ->
                do event.preventDefault
                @amount = filterXSS(amount.toString())
                @submit_sending = true

                if !@amount||parseInt @amount <=0
                      @mg_alert "请填写提现金额!"
                      return false
                lccbUserId=parseInt(@user.info.lccbUserId)
                if !@user.info || lccbUserId is -1 || lccbUserId is 0
                  @mg_alert "您尚未开通存管，请开通后在操作"
                  $location
                    .replace()
                    .path "dashboard/payment/register"
                  return
                return unless !!@amount and !!@user.info and !!@user.info.lccbUserId
                      
                (@api.payment_pool_lccb_withdraw(@user.info.id,@amount,@successUrl)

                  .then (data) =>
                      return @$q.reject(data) unless data.status is 0
                      return data

                  .then (data) =>
                      @$window.form.action=data.data
                      do @$window.form.submit

                      #@mg_alert @$scope.msg.SUCCEED
                      #    .result.finally =>
                      #        @$location.path 'dashboard'

                      #@$scope.$on '$locationChangeStart', (event, new_path) =>
                      #    event.preventDefault()
                      #    @$window.location = new_path
                      

                  .catch (data) =>
                      @submit_sending = false
                      #key = _.get data, 'error[0].message'|| _.get data, 'msg'
                      console.log "data:",data
                      @mg_alert _.get data, 'msg'
                  .finally =>
                      42
                )
          

    

                    
                  