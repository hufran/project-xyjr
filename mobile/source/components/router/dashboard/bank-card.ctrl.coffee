
do (_, angular) ->

    angular.module('controller').controller 'BankCardCtrl',

        _.ai '            @user, @$scope, @$window', class
            constructor: (@user, @$scope, @$window) ->

                @$window.scrollTo 0, 0

                @$scope.bank_account = @user.bank_account

