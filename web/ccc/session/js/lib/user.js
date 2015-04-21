'use strict';
var Bacon = require('baconjs');
var bus = require('ccc/reactive/js/lib/bus');
var currentUser = new Bacon.Bus();
/* 表示当前登录用户的 property
通过 bus('session:user') 输入
需要改变时（如注册成功、登录成功），执行 bus('session:user').push(user)
退出（用户主动退出、session 过期等等）时 bus('session:user').push(void 0) 设置成 undefined

输出为 user 对象或 undefined，默认值是 CC.user, 从后端 expose 出来的
*/
currentUser.plug(bus('session:user'));
exports.property = currentUser.toProperty(CC.user);
