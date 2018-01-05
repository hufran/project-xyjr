
do (_, angular) ->

    angular.module('controller').controller 'PaymentListCtrl',

        _.ai '            @api, @user, @$scope, @$rootScope, @$window, @$location', class
            constructor: (@api, @user, @$scope, @$rootScope, @$window, @$location) ->

                @$window.scrollTo 0, 0

                @$rootScope.state = 'dashboard'
           
                angular.extend @$scope, {
                    list: []
                    status: {
	                    inPayment:"还款中",
	                    overdue:"已逾期",
	                    settle:"已结清"
                    }
                }

     			#此处需要更换接口
     			#(@api.fetch_coupon_list()
     			#	.then (data) =>
     			#		return @$q.reject(data) unless data.success is true
     			#		return data
                #   .then (data) =>
                #    	console.log data
                #    	@$scope.list=data.data
                #    .catch (data) =>
                #    	@$window.alert data.msg
     			#)