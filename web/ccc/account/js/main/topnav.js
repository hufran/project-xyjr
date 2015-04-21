'use strict';
require('assets/js/modules/tooltip');
var $ = global.jQuery = require('jquery');

$('ul.info li')
    .tooltip({
        placement: 'top',
        container: $('.info-tooltip-container')
    });