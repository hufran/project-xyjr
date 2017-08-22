
do (_, angular) ->

 angular.module('controller').controller 'EducationCtrl',

   _.ai '            @$scope, @$window', class
    constructor: (@$scope, @$window) ->

     @$window.scrollTo 0, 0



