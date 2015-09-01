'use strict';
var url = require('url');
var crypto = require('crypto');
var config = require('config');
var conext = require('conext');
var ccBody = require('cc-body');
var xml2json = require('xml2json');
var wxrequest = require('./wxrequest');
var xtend = require('xtend');
var db = require('@cc/redis');
var log = require('bunyan-hub-logger')({ app: 'web', name: 'wx' })

function randomHex(len) {
    return new Promise(function (resolve, reject) {
        crypto.randomBytes(len, function (err, buf) {
            if (err) {
                return reject(err);
            }
            resolve(buf.toString('hex'));
        });
    });
}

function sha1(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
}
var urlPrefix = (config.useHttps?'https://':'http://') + config.domain;
module.exports = function (router) {
    if ((process.env.NODE_ENV || 'development') === 'development') {
        return; // 这个模块只在 生产环境、测试环境加载
    }
    router.get('/wx/auth', function (req, res) {
        var options = url.parse('https://open.weixin.qq.com/connect/oauth2/authorize#wechat_redirect');
            options.query = {
                appid: config.weixinmp.appid,
                redirect_uri: encodeURIComponent(urlPrefix + '/wx/auth/return'),
                response_type: 'code',
                scope: 'snsapi_base',
            };

        res.redirect(url.format(options));
    });
    router.get('/wx/auth/return', conext(function *(req, res) {
        var r = yield request('https://api.weixin.qq.com/sns/oauth2/access_token', {
            query: {
                appid: config.weixinmp.appid,
                secret: config.weixinmp.secret,
                grant_type: 'authorization_code',
                code: req.query.code,
            },
        });
        if (r.text[0] === '{') {
            res.type('json');
        }
        res.end(r.text);
    }));

    router.get('/wx/auth/redirect', conext(function *(req, res) {
        var ccat;
        console.log('weixin/ccatkey:' + req.query.ccatkey);
        try {
            ccat = yield db.get('weixin/ccatkey:' + req.query.ccatkey);
        } catch (e) {}
        log.debug({ type: 'wxredirect', code: req.query.code, ccatkey: req.query.ccatkey, ccat: ccat });
        if (!ccat) {
            return res.redirect(req.query.url || req.query.state || '/login');
        }
        res.cookie('ccat', ccat, {
            maxAge: config.loginCookieMaxAge || 30 * 60 * 1000,
        });
        res.redirect(req.query.url || req.query.state || '/account');
    }));

    wxrequest('POST', '/cgi-bin/menu/create', {
        body: config.weixinmp.menu,
    }).get('body').then(function (body) {
        log.debug({ type: 'wxmenu', body: body }, '微信公众号设置菜单返回：');
    });

    function checkSignature(req, res, next) {
        log.debug({ type: 'wxmessage', req: req });
        var hash = sha1([config.weixinmp.token, req.query.timestamp, req.query.nonce].sort().join(''));
        if (hash !== req.query.signature) {
            res.status = 403;
            res.end('');
            return;
        }
        next();
    }

    router.get('/wx/message', checkSignature, function (req, res, next) {
        res.type('txt');
        res.end(req.query.echostr || '');
    });

    router.post('/wx/message', checkSignature, ccBody.text, conext(function* (req, res, next) {

        var payload;
        try {
            payload = JSON.parse(xml2json.toJson(req.body)).xml;
        } catch (e) {};
        log.debug({ type: 'wxmessage', raw: req.body, payload: payload });
        var unionId;
        if (config.weixinmp.useUnionId) {
            var wxuser = yield wxrequest('/cgi-bin/user/info', {
                query: {
                    openid: payload.FromUserName,
                },
            }).get('body');
            log.debug({ type: 'wxmessage', wxuser: wxuser });
            unionid = wxuser.unionid;
        }

        res.type('xml');
        var baseRetObj = {
            ToUserName: CDATA(payload.FromUserName),
            FromUserName: CDATA(payload.ToUserName),
            CreateTime: CDATA(Date.now()),
        };
        /*/
        var textRetObj = xtend(baseRetObj, {
            MsgType: CDATA('text'),
            Content: CDATA('hello world'),
        });
        /*/

        var socialId = config.weixinmp.useUnionId
            ? 'unionid:' + unionid
            : 'openid:' + payload.FromUserName;
        var socialAuthResult = yield request('POST',
            config.proxy.market, '/api/v2/auth/social', {
            body: {
                socialType: 'WEIXIN',
                socialId: socialId,
            },
        }).get('body');
        log.debug({ type: 'wxmessage', socialAuthResult: socialAuthResult });
        var item, user;
        item = {
            Title: CDATA('请先绑定帐号'),
            Description: CDATA('需要先绑定帐号才能继续查询账户信息，请点击以下“全文”链接绑定帐号。'),
            Url: CDATA(urlPrefix + '/login?bind_social_weixin=' + socialId),
        };
        if (socialAuthResult.user && socialAuthResult.user.id) {
            user = socialAuthResult.user;
            var obj = {
                user: user,
                client: {
                    name: 'node',
                    id: config.oauth2client.id,
                },
                scope: [],
            };
            var ccat = yield randomHex(32);
            yield db.setex('access_token:' + ccat, 24 * 60 * 60, JSON.stringify(obj));
            var ccatkey = yield randomHex(16);
            yield db.setex('weixin/ccatkey:' + ccatkey, 300, ccat);

            var results = yield [
                request(config.proxy.market, '/api/v2/user/' + user.id + '/payment').get('body'),
                request(config.proxy.market, '/api/v2/user/' + user.id + '/userfund').get('body'),
                request(config.proxy.market, '/api/v2/user/' + user.id + '/fundaccounts').get('body'),
            ];
            var user = xtend(user, results[0], results[1]);
            user.bankCards = results[2];
            log.debug({ type: 'wxmessage', user: user });

            item.Title = CDATA('我的账户信息');
            item.Description = CDATA('可用余额：'+user.availableAmount+'\n冻结余额：'+user.frozenAmount);
            item.Url = CDATA(urlPrefix + '/wx/auth/redirect?ccatkey='+ccatkey);
        }
        log.debug({ type: 'wxmessage', item: item });
        /*/
        var newsRetObj = xtend(baseRetObj, {
            MsgType: CDATA('news'),
            ArticleCount: CDATA(1),
            Articles: [{item: item}],
        });


        //*/
        var xml = xml2json.toXml({ xml: newsRetObj });
        //var xml = xml2json.toXml({ xml: textRetObj });
        res.end(xml);
    }));
    function CDATA(data) {
        return {
            $t: typeof data === 'number' ? data : '<![CDATA[' + data + ']]>',
        };
    }

    router.get(/^\/wx\//, function (req, res) {
        res.end('');
    });

};
