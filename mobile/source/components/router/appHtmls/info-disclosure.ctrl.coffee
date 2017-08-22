
do (_, angular) ->

 angular.module('controller').controller 'InfoDisclosureCtrl',

   _.ai '            @api, @user, @$scope, @$location, @$window, map_loan_summary, @$uibModal, @$routeParams', class
    constructor: (@api, @user, @$scope, @$location, @$window, map_loan_summary, @$uibModal, @$routeParams) ->

     @$window.scrollTo 0, 0
     #        console.log @$routeParams.id
     #        @test(@$routeParams.id,@$routeParams.token)

     #        filter_type = @$routeParams.type

     angular.extend @$scope, {
#          filter_type
#          userId: @$routeParams.id
#          amount: @$routeParams.amount
#          retUrl: @$routeParams.retUrl.toString()
#          bankCode: @$routeParams.bankCode
#          token:@$routeParams.token
#          action1:'/api/v2/jdpay/onlineBankDeposit4Wap/'+@$routeParams.id
#          plateIntro:'<p>我是空的</p>'
     }
#     @api.get_article('INTRODUCTION','平台介绍').then (data) =>
##       console.log data[0].content
#       @$scope.plateIntro = data[0].content
     @test()


#        @submitForm()
#      test:(userId,token) ->
#        isUsefulToken(userId,token);
    test: ->
     publicTest()
    agreement: (segment) ->

      prompt = @$uibModal.open {
        size: 'lg'
        backdrop: 'static'
        windowClass: 'center'
        animation: true
        templateUrl: 'ngt-register-agreement.tmpl'

        resolve: {
          content: _.ai '$http', ($http) ->
            $http
            .get "/api/v2/cms/category/DECLARATION/name/#{ segment }", {cache: true}
            .then (response) -> _.get response.data, '[0].content'
        }

        controller: _.ai '$scope, content',
          (             $scope, content) ->
            angular.extend $scope, {content}
      }

      once = @$scope.$on '$locationChangeStart', ->
        prompt?.dismiss()
        do once



