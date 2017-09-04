
do (_, angular) ->

 angular.module('controller').controller 'EducationCtrl',

   _.ai '            @api, @$scope, @$window, @$routeParams,@$location', class
    constructor: (@api, @$scope, @$window, @$routeParams,@$location) ->

      @$window.scrollTo 0, 0
      params = {
        XXPL: '信息披露',
        FXJY:'风险教育'
      }
      search=filterXSS(@$window.location.search).split("=")[1]
      
      angular.extend @$scope, {
        category:@$routeParams.category
        categoryName:params[@$routeParams.category]
        hideHeader:search
      }
#     hideHeader:@$location.search().app
#      @api.get_article(@$scope.category,encodeURI(@$scope.riskName)).then (data) =>
##          console.log data[0].content
#        @$scope.articles = data
      @api.get_category(@$scope.category).then (response) =>
#       console.log response
        @$scope.categoryAll = response


