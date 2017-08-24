
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
       articles:''
     }
     @api.get_category('XXPL').then (data) =>
       _results = []

       _articleContent = [[],[],[],[],[],[],[],[],[]]
       for item in data
         if item.category == 'XXPL'
           @api.get_article(item.category,encodeURI(item.name)).then (data1) =>
             switch data1[0].title
               when "公司信息" then _articleContent[0] = [data1[0].title,data1[0].content]
               when "治理信息" then _articleContent[1] = [data1[0].title,data1[0].content]
               when "运营信息" then _articleContent[2] = [data1[0].title,data1[0].content]
               when "平台信息" then _articleContent[3] = [data1[0].title,data1[0].content]
               when "信息安全" then _articleContent[4] = [data1[0].title,data1[0].content]
               when "重大事件" then _articleContent[5] = [data1[0].title,data1[0].content]
               when "风控体系" then _articleContent[6] = [data1[0].title,data1[0].content]
               when "审计报告" then _articleContent[7] = [data1[0].title,data1[0].content]
               when "合规报告" then _articleContent[8] = [data1[0].title,data1[0].content]
#               else break
#             _articleContent.push([data1[0].title,data1[0].content])
#           _results.push(item)

       console.log _articleContent
       @$scope.articles = _articleContent


#       @$scope.plateIntro = _results
#       for list in _results
#         @api.get_article(list.category,encodeURI(list.name)).then (data1) =>
#           _articleContent.push([data1[0].title,data1[0].content])
#       @$scope.articles = _articleContent
#       console.log @$scope.articles





       @test()
#       @$scope.$watch "plateIntro",-> equals("publicTest()")



    test: ->
     publicTest()
#    agreement: (segment) ->
#
#      prompt = @$uibModal.open {
#        size: 'lg'
#        backdrop: 'static'
#        windowClass: 'center'
#        animation: true
#        templateUrl: 'ngt-register-agreement.tmpl'
#
#        resolve: {
#          content: _.ai '$http', ($http) ->
#            $http
#            .get "/api/v2/cms/category/DECLARATION/name/#{ segment }", {cache: true}
#            .then (response) -> _.get response.data, '[0].content'
#        }
#
#        controller: _.ai '$scope, content',
#          (             $scope, content) ->
#            angular.extend $scope, {content}
#      }
#
#      once = @$scope.$on '$locationChangeStart', ->
#        prompt?.dismiss()
#        do once



