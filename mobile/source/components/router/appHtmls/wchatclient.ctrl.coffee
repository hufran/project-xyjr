
do (_, angular) ->

  angular.module('controller').controller 'WchatClientCtrl',

    _.ai '            @api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams', class
      constructor: (@api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams) ->

        @$window.scrollTo 0, 0
#        @test()

        angular.extend @$scope, {
#          filter_type
#
#          userId: @$routeParams.id
#          amount: @$routeParams.amount
#          retUrl: @$routeParams.retUrl.toString()
#          bankCode: @$routeParams.bankCode
#          token:@$routeParams.token
#          action1:'/api/v2/jdpay/onlineBankDeposit4Wap/'+@$routeParams.id
        }




      test:->
        publicTest();




