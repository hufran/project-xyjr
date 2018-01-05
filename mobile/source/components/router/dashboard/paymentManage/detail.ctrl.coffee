do (_, angular) ->

    angular.module('controller').controller 'PaymentDetailCtrl',

        _.ai '            @api, @user, @repayment, @$scope, @$rootScope, @$window, @$routeParams, @$location', class
            constructor: (@api, @user, @repayment, @$scope, @$rootScope, @$window, @$routeParams, @$location) ->
            	
            	@$window.scrollTo 0, 0
            	console.log "22222"

            	angular.extend @$scope,{
            		title:"还款中"
            		dateTime:"2016/08/01"
            		term:7,
            		interest:"0.88%",
            		protocolUrl:"#",
            		moneyVal:"101760",
            		dataList:[
            			{paymentDate:"2017/04/01",paymentMoney:8884.88,status:"已还款",id:1}
            		]
            	}
