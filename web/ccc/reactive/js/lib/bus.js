'use strict';
var Bacon = require('baconjs');
var intercom = require('assets/js/lib/intercom').getInstance();
var isEqual = require('lodash-node/compat/objects/isEqual');
var busCache = {};
module.exports = function (busName) {
    var bus;
    if ((bus = busCache[busName])) {
        return bus;
    }
    bus = busCache[busName] = new Bacon.Bus();
    var lastValue;
    bus.onValue(function (value) {
        if (!isEqual(lastValue, value)) {
            lastValue = value;
            intercom.emit(busName, value);
        }
    });
    intercom.on(busName, function (value) {
        if (!isEqual(lastValue, value)) {
            lastValue = value;
            bus.push(value);
        }
    });
    return bus;
};