'use strict';
module.exports = function (router, auth) {
    router.get('/api/v0/hello/world', auth.pass());
};
