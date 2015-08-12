
do (_, angular) ->

    angular.module('controller').controller 'PaymentUmpAgreementCtrl',

        _.ai             '@baseURI, @cookie2root, @$scope, @$window', class
            constructor: (@baseURI, @cookie2root, @$scope, @$window) ->

                @$window.scrollTo 0, 0


            submit: (event) ->

                @cookie2root 'return_url', @baseURI + 'dashboard'
