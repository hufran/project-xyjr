
do (_, angular) ->

  angular.module('controller').controller 'HelpCenterCtrl',

    _.ai '            @api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams', class
      constructor: (@api, @user, @$scope, @$location, @$window, map_loan_summary, @$routeParams) ->

        @$window.scrollTo 0, 0

        
        angular.extend @$scope, {
            informationList:['注册/登录','资金存管','红包相关','信息变更','常见问题'],
            category:'HELP',
            informationDetail:[],
            show:@$routeParams.show
        }
        do @getInfo




#        @submitForm()
#      test:(userId,token) ->
#        isUsefulToken(userId,token);
      getInfo: ->
        for data,i in @$scope.informationList
          @sendRequest(i)
            
      sendRequest: (index)->
      	
        @api.get_article(@$scope.category,encodeURIComponent(@$scope.informationList[index])).then (data) =>
          @$scope.informationDetail[index]=data[0].content




