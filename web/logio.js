"use strict";
var winston = require("winston");


// 起logio
var LogServer = require("cc-log.io")
    .LogServer;

var WebServer = require("cc-log.io")
    .WebServer;

var logger = new winston
    .Logger({
        transports: [new winston.transports.Console({
            level: 'error'
        })]
    });

var logConf = require('config')
    .logio;
var webConf = require('config')
    .logio_web;

logConf.logging = logger;
webConf.logging = logger;

var logServer = new LogServer(logConf);
var webServer = new WebServer(logServer, webConf);

webServer.run();