
do (_, angular) ->

  angular.module('controller').controller 'EducationRiskCtrl',

    _.ai '            @api, @$scope, @$window, @$routeParams,@$location', class
      constructor: (@api, @$scope, @$window, @$routeParams,@$location) ->

        @$window.scrollTo 0, 0
        console.log @$routeParams.category
        angular.extend @$scope, {
#          filter_type
#          userId: @$routeParams.id
#          amount: @$routeParams.amount
#          retUrl: @$routeParams.retUrl.toString()
#          bankCode: @$routeParams.bankCode
#          token:@$routeParams.token
          riskName:@$routeParams.name
          category:@$routeParams.category
          articles: null
        }
        @api.get_article(@$scope.category,encodeURI(@$scope.riskName)).then (data) =>
#          console.log data[0].content
          @$scope.articles = data




