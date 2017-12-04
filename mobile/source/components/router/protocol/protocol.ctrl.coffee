
do (_, angular) ->

  angular.module('controller').controller 'ProtocolCtrl',

    _.ai '            @api, @$scope, @$window, @$routeParams', class
      constructor: (@api, @$scope, @$window, @$routeParams) ->

        @$window.scrollTo 0, 0

        searchArr=@$window.location.search.substring(1,@$window.location.search.length).split("=")
        console.log "@$routeParams：",@$routeParams.name
        angular.extend @$scope, {
          protocolTitle:null,
          content:null,
          hideHeader:searchArr[0]=="app"&&searchArr[1]
        }

        requestList={
          register:'廊坊银行网络借贷交易资金存管业务三方协议',
          commitment:'网络借贷风险和禁止性行为提示书及资金来源合法承诺书'
        }

        for list of requestList
          if @$routeParams.name==list
            console.log "list:",list
            @api.get_protocol_detail requestList[list]
              .then (data) =>
                @$scope.content=data[0].content
                @$scope.protocolTitle=data[0].title
