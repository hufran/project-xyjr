
do (_, angular) ->

    angular.module('controller').controller 'LYGOrderCtrl',

        _.ai '            @order, @api, @$location, @$scope, @$window, @$q', class
            constructor: (@order, @api, @$location, @$scope, @$window, @$q) ->

                @$window.scrollTo 0, 0

                @$scope.order = @order
                @$scope.goods = @order.gome_goods_pick
