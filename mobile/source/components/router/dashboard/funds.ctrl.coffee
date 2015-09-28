
do (angular, window) ->

    angular.module('controller').controller 'FundsCtrl',

        _.ai '            @api, @data, @$scope, @$window, @map_funds_summary', class
            constructor: (@api, @data, @$scope, @$window, @map_funds_summary) ->

                @$window.scrollTo 0, 0

                @on_load @data.results


            on_load: (list, done = false) =>

                @length_catch ?= [list.length]
                @length_catch.push list.length

                [..., prev, last] = @length_catch

                if done or prev isnt last
                    return @$scope.list = list.map @map_funds_summary

                if prev is last and @length_catch.length > 3
                    return @on_load list, true

                @api.get_user_funds()
                    .then (response) -> response.results
                    .then @on_load

                return









    angular.module('factory').factory 'map_funds_summary', -> (item) ->
        sign = (IN: '+', OUT: '-')[item.operation] or ''

        return {
            sign: sign
            type: item.type
            amount: item.amount
            date: item.recordTime
            operation: item.operation
            description: item.description

            sign_css_class: switch sign
                when '+' then 'green'
                when '-' then 'red'
                else          'gray'
        }
