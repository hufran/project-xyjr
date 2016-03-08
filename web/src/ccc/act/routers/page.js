'use strict';
var middlewares = require('../middlewares');
var ccBody = require('cc-body');

module.exports = function (router) {
    router.get('/', function (req, res, next) {
		_.assign(res.locals, {
            title : '3.8妇女节-718_金融理财平台',
            keywords : '3.8妇女节-718_金融理财平台',
            description : '3.8妇女节-718_金融理财平台'
        });

        res.expose('/api/web/register/smsCaptcha', 'registerSmsCaptchaApi');
        res.expose('/api/web/register/voiceCaptcha', 'CC.registerVoiceCaptchaApi');
        res.expose('/api/web/register/submit', 'registerSubmit');
        res.expose(req.query.refm, 'registerRel');
		res.expose(req.query.UID, 'comefromRel');
        next();
    }, middlewares.registerPage);
};
