
do (_, angular) ->

    angular.module('controller').controller 'HomepageCtrl',

        _.ai '            @api, @user, @$scope, @$window, map_loan_summary, @$location', class
            constructor: (@api, @user, @$scope, @$window, map_loan_summary, @$location) ->

                @$window.scrollTo 0, 0

                EXTEND_API @api

                angular.extend @$scope, {
                    list: {}
                    page_path: './'
                    appTypeLink:''
                    carousel_height: do (width = @$window.document.body.clientWidth) ->
                        width * 260 / 640 # aspect ratio of banner image
                }
                @api.homepage_fetch_loan_list().then (data) =>
                    data = _.mapValues data, (list) -> list.map map_loan_summary
                    _.assign @$scope.list, data
                if @test(1) is '1'
                    @$scope.appTypeLink = 'https://itunes.apple.com/us/app/718金融理财/id1230763335?l=zh&ls=1&mt=8'
                else if @test(1) is '0'
                    @$scope.appTypeLink = 'http://718bank.com/ccc/app/718bank.apk'
                else
                    @$scope.appTypeLink = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.xinyi.lc'


            num: (amount) ->
                amount = amount | 0
                is_myriad = amount.toString().length > 3

                return {
                    amount: amount
                    myriad: if is_myriad then (amount / 10000) | 0 else null
                }
            test: (amount) ->
                return ismobile(amount);









    EXTEND_API = (api) ->

        api.__proto__.homepage_fetch_loan_list = ->

            @$http
                .get '/api/v2/loans/home/summary', cache: true

                .then @TAKE_RESPONSE_DATA
                .catch @TAKE_RESPONSE_ERROR

                .then (data) -> _.mapKeys data, (value, key) -> {
                        '新手专享': 'XSZX'
                        '活动专享': 'HDZX'
                        '新抵宝': 'FB'
                        '新能宝': 'XNB'
                        '薪金宝': 'XJB'
                    }[key]
