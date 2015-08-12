
do (angular, Object) ->

    angular.module('controller').controller 'InviteCtrl',

        _.ai '            @user, @api, @$location, @$scope, @$rootScope, @$window, baseURI', class
            constructor: (@user, @api, @$location, @$scope, @$rootScope, @$window, baseURI) ->

                @$window.scrollTo 0, 0

                @$scope.logo = encodeURIComponent baseURI + 'assets/image/u-qr-logo.png'

                unless @user.info?.mobile_encrypt
                    @api.mobile_encrypt(@user.info.mobile).then (response) =>
                        @user.info.mobile_encrypt = response.data

                Object.defineProperties @$scope,
                    share_link: {
                        get: =>
                            result = @$location.absUrl().split('/')[0..2]
                            result.push 'register?rel=' + @user.info?.mobile_encrypt or ''
                            return result.join '/'
                    }
