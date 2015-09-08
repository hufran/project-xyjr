
do (angular) ->

    angular.module('directive').directive 'carouselBanner',

        _.ai 'api', (api) ->

            restrict: 'AE'

            scope:
                interval: '=delayInSeconds'

            template: '''
                <carousel interval="interval * 1000" no-wrap="noWrapSlides">
                    <slide ng-repeat="slide in slides" active="slide.active">
                        <a ng-href="{{ slide.url }}">
                            <img ng-src="{{ slide.content }}" style="margin:auto;">

                            <div class="carousel-caption" ng-if>
                                <p>{{ slide.title }}</p>
                            </div>
                        </a>
                    </slide>
                </carousel>
            '''

            link: (scope, element, attr) ->

                api.get_carousel_banners().then (data) ->
                    scope.slides = data
