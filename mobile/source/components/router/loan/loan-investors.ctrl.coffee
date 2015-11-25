
do (_ ,angular, decodeURI) ->

    angular.module('controller').controller 'LoanInvestorsCtrl',

        _.ai '            @investors, @$scope, @$window, @$routeParams', class
            constructor: (@investors, @$scope, @$window, @$routeParams) ->

                @$window.scrollTo 0, 0

                @$scope.id = @$routeParams.id

                @$scope.investors = @investors.map (item) ->

                    item.userLoginName = item.userLoginName.trim()

                    prefix = new RegExp decodeURI '^%E6%89%8B%E6%9C%BA%E7%94%A8%E6%88%B7'
                    name = item.userLoginName.replace prefix, ''

                    prefix = /^[a-zA-Z]{4}_/
                    name = name.replace prefix, ''

                    if name isnt item.userLoginName
                        item.name = name.replace /(\d{2})(\d+)(\d{2})$/, '$1*******$3'
                    else
                        [empty, head, tail] = name.split /^(..)/

                        item.name = head + tail.replace /./g, '*'
                        item.name = "#{ head[0] }*" if name.length < 3

                    return item
