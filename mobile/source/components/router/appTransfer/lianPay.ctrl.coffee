
do (_, angular) ->

 angular.module('controller').controller 'LianPayCtrl',

   _.ai '            @api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams', class
    constructor: (@api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams) ->

     @$window.scrollTo 0, 0
#     @test(@$routeParams.id,@$routeParams.token)
     filter_type = @$routeParams.type

     angular.extend @$scope, {
      filter_type
      userId: @$routeParams.id
      amount: @$routeParams.amount
      retUrl: @$routeParams.retUrl.toString()
#      bankCode: @$routeParams.bankCode
#      token:@$routeParams.token
      action:'/api/v2/lianlianpay/deposit/'+@$routeParams.id
     }




     @submitForm()
#    test:(userId,token) ->
#     isUsefulToken(userId,token);
    submitForm: ->
     console.log 1
     a();



