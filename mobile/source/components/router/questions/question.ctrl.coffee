
do (_, angular) ->

  angular.module('controller').controller 'QuestionCtrl',

    _.ai '            @api, @user, @loan, @$scope, @$location, @$window, map_loan_summary, @$routeParams', class
      constructor: (@api, @user, @loan, @$scope, @$location, @$window, map_loan_summary, @$routeParams) ->

        @$window.scrollTo 0, 0

        filter_type = @$routeParams.type

        if @$routeParams.comeIn=="true"
          @$routeParams.comeIn=1
        else
          @$routeParams.comeIn=0


        angular.extend @$scope, {
          filter_type
          page_path: @$location.path()[1..]
          back_path: @$routeParams.back
          isClient: @$routeParams.token
          clientUserId: @$routeParams.uid
          loan: map_loan_summary @loan
          loading: true
          showPay:@$routeParams.showPay
          qusComeIn:@$routeParams.comeIn
        }
        console.log "@$routeParams.showPay:",typeof @$routeParams.showPay

        (@api.get_loan_list_by_config(filter_type, 20, false)

        .then ({results}) =>

          @$scope.list =
            _(results)
            .compact()
            .map map_loan_summary
            .value()

        .finally =>
          @$scope.loading = false
        )

        if(@$scope.clientUserId != undefined)
          @getResult(@$scope.clientUserId)
      getResult:(id) ->
        getMark(id);
