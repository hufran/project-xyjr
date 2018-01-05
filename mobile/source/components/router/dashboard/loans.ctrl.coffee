do (_, angular) ->

    angular.module('controller').controller 'LoansCtrl',

        _.ai '            @api, @user, @$scope, @$rootScope, @$window, @$location', class
            constructor: (@api, @user, @$scope, @$rootScope, @$window, @$location) ->

            	@$window.scrollTo 0, 0
            	@$rootScope.state = 'dashboard'
            	
            	
            	
