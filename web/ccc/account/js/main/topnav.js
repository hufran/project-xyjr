'use strict';
require('ccc/global/js/modules/tooltip');

$('ul.info li')
    .tooltip({
        placement: 'top',
        container: $('.info-tooltip-container')
    });
