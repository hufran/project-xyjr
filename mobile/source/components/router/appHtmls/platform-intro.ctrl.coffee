
do (_, angular) ->

  angular.module('controller').controller 'PlatformintroCtrl',

    _.ai '            @api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams', class
      constructor: (@api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams) ->

        @$window.scrollTo 0, 0
#        console.log @$routeParams.id
#        @test(@$routeParams.id,@$routeParams.token)
        
#        filter_type = @$routeParams.type
        
        angular.extend @$scope, {
        	informationList:['公司信息','治理信息','风控体系','运营信息','平台信息','审计报告','合规报告','信息安全','重大事件'],
        	category:'XXPL',
        	informationDetail:[]
        }
        do @getInfo




#        @submitForm()
#      test:(userId,token) ->
#        isUsefulToken(userId,token);
      getInfo: ->
        for data,i in @$scope.informationList
          @sendRequest(i)
        @test()
            
      sendRequest: (index)->
        @api.get_article(@$scope.category,encodeURI(@$scope.informationList[index])).then (data) =>
          @$scope.informationDetail[index]={class:"slide-"+(index+1),data:data[0].content}
      test: ->
        publicTest();



