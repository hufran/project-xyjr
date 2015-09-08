"use strict";

var pathFn = require('path');

module.exports = {
    // project name 作为 log.io的 node name
    project_name: pathFn.basename(pathFn.join(__dirname, "..")),
    // port 用于开发调试，每个新项目 +1
    port: 4001,
    domain: 'zqjr.uats.cc',

    commonjs: [ // 最常被引用的库写到这里，开发环境加速
        'bluebird',
        'jquery',
        'ractive/ractive-legacy',
        'moment',
        'cc-superagent-promise',
        'chart.js/Chart',
    ],

    // 支付相关配置，这里主要是联动和联动两种方式的配置
    payment: {
        // 汇付具体配置
        pnr: {
            postUrl: 'http://mertest.chinapnr.com/muser/publicRequests',
            protocol: 'http://',
        },
        //连连支付
        lianlian: {
            postUrl: '',
            protocol: 'http://',
        },
        // 联动具体配置
        upayment: {
            // 针对https的三方回调处理
            https: false,

            // 各个操作对应的form action path
            action: {
                // 充值
                netSave: '/netSave',

                // 绑卡
                bindCard: '/bindCard',

                // 投标
                tender: '/tender',

                // 取现
                withdraw: '/withdraw',

                // 签订用户协议
                bindAgreement: '/bindAgreement',

                // 解绑用户协议
                unbindAgreement: '/unbindAgreement',

                // 给商户转账
                usrAcctPay: '/usrAcctPay'
            },

            // 是否开启无密主动投标
            nopwd: {
                // 无密主动投标action
                tender: '/nopwd/tender'
            }
        }
    },


    // 分一下层? config.logs.xxx

    // logio LogServer
    logio: {
        host: "127.0.0.1",
        port: 28777
    },

    // log.io WebServer
    logio_web: {
        host: "127.0.0.1",
        port: 28778
    },

    // winston 默认的levels,所有的levels都统一
    // 必须有debug level, debug("xxx") 作为debug level
    levels: {
        silly: 0,
        debug: 1,
        verbose: 2,
        info: 3,
        warn: 4,
        error: 5
    },

    // log.io 网页端,默认的level
    client_default_level: 5,


    // console消息到 log.io 的 stream 名称
    console_stream_name: "console_msg",
    // console消息 记录到文件的 文件名
    console_file_name: "console.log",

    // 记录到文件的最低level
    file_level: "warn",
    // 输出到文件的最低level
    logio_level: "debug",

    // 存放xxx.log 的文件夹
    logs_dir: pathFn.join(__dirname, "..", "logs"),
    urlLoanVerify: "http://172.30.0.216:8080/aimp/index",
    verifySystemCode: "QY0002",
    verifySystemMd5key: "QY0002",

    // 邀请码配置文件
    urlInvitation: "http://118.244.210.161/_api/p2pcheckinvitecode?output=json",
    // 从config.json拿过来的
    urlBackend: "http://127.0.0.1:4100/",
    oauth2client: {
         id:  "client-id-for-node-dev",
         secret: "client-secret-for-node-dev",
    },

    weixinmp: { // 微信公共帐号绑定的相关配置
        appid: 'appid',
        secret: 'secret',
        token: 'token for message signature',
        useUnionId: false, // 默认只使用 openId，打开此配置可获取 unionId
        defaultBackUrl: '/account',

        menu: { // 每次启动 web 时会 post 给微信服务器设置自定义菜单
            button: [
            {
                "type":"view",
                "name":"我的账户",
                "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx996e9ad463045dc3&redirect_uri=http%3A%2F%2Fzqjr.uats.cc%2Fwx%2Fauth%2Fredirect&state=%2Fh5%2Faccount&response_type=code&scope=snsapi_base#wechat_redirect"
            },
            {
                "type":"click",
                "name":"账户余额",
                "key":"my_account"
            },
/*
            {
                "name":"菜单",
                "sub_button":[
                {
                    "type":"view",
                    "name":"搜索",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"视频",
                    "url":"http://v.qq.com/"
                },
                {
                    "type":"click",
                    "name":"赞一下我们",
                    "key":"V1001_GOOD"
                }]
            }
*/
            ]
        }
    },

};
