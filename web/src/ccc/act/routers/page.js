'use strict';
var middlewares = require('../middlewares');
var ccBody = require('cc-body');

module.exports = function (router) {
    router.get('/', function (req, res, next) {
		_.assign(res.locals, {
            title : '活动页面-718_金融理财平台',
            keywords : '活动页面-718_金融理财平台',
            description : '活动页面-718_金融理财平台'
        });

        res.expose('/api/web/register/smsCaptcha', 'registerSmsCaptchaApi');
        res.expose('/api/web/register/voiceCaptcha', 'CC.registerVoiceCaptchaApi');
        res.expose('/api/web/register/submit', 'registerSubmit');
        res.expose(req.query.refm, 'registerRel');
		res.expose(req.query.UID, 'channelRel');
        next();
    }, middlewares.registerPage);
};
