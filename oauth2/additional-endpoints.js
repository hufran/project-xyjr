'use strict';
var auth = require('@cc/oauth2').auth;
var router = require('express').Router();
module.exports = router;

router.get('/api/v0/hello/world', auth.pass());
router.get('/api/v0/hello/:userID', auth.user());
