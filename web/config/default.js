"use strict";

var pathFn = require('path');

module.exports = {
    // project name 作为 log.io的 node name
    project_name: pathFn.basename(pathFn.join(__dirname, "..")),
    // port 用于开发调试，每个新项目 +1
    port: 4001,

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
        // 联动具体配置
        payment: {},

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
    urlBackend: "http://123.59.61.50/",
    oauth2client: {
         id: "a266a555-856c-49d9-8941-f1d68a03c551",
         secret: "726bfcfdb267ea0fd971481640c9efe59a3786d6d961e96296eb9229f42dd1f9"
    }
};
