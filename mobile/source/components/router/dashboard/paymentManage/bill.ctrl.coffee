do (_, angular) ->

    angular.module('controller').controller 'PaymentBillCtrl',

        _.ai '            @api, @user, @$scope, @$rootScope, @$window, @$routeParams, @$location', class
            constructor: (@api, @user, @$scope, @$rootScope, @$window, @$routeParams, @$location) ->
            	
            	@$window.scrollTo 0, 0
            	console.log "22222"

            	angular.extend @$scope,{
                    title:"第2期账单",
                    principal:"20000",
                    interest:1000,
                    managementFee:500,
                    penalty:80,
                    defautInterest:50,
                    remission:130,
                    repay:21500,
                    repayDate:"2017-05-31"
                }
