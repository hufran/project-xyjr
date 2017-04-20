
do (_, angular) ->

  angular.module('controller').controller 'AppJdPayCtrl',

    _.ai '            @api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams', class
      constructor: (@api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams) ->

        @$window.scrollTo 0, 0
        console.log @$routeParams.id
        @pay_type = 'lianlianPay'
        @test(@$routeParams.id,@$routeParams.token)
        filter_type = @$routeParams.type

        angular.extend @$scope, {
          filter_type
          userId: @$routeParams.id
          amount: @$routeParams.amount
          retUrl: @$routeParams.retUrl.toString()
          bankCode: @$routeParams.bankCode
          token:@$routeParams.token
        }
        if @pay_type == 'lianlianPay'
          @$scope.action = '/api/v2/lianlianpay/deposit/'+@$routeParams.id
          @$scope.payPlat = '连连'
          @$scope.amount = @$routeParams.amount/100
        else
          @$scope.action = '/api/v2/jdpay/onlineBankDeposit4Wap/'+@$routeParams.id
          @$scope.payPlat = '京东'




        @submitForm()
      test:(userId,token) ->
        isUsefulToken(userId,token);
      submitForm: ->

#        console.log 1
        a();



