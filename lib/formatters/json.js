/**
 * json.js - json formatter
 */

var _ = require('lodash'),
    inherits = require('util').inherits;

/**
 * JSON Formatter
 */
var JSONFormatter = module.exports = function(config) {

    var self = this;

    JSONFormatter.super_.call(this, _.merge({
        pretty: false,
        stringifyMessage: false,
        fields: (config||{}).fields ? [] :  ['message', 'date', 'dtime', 'time', 'level', 'process', 'name', 'location']
    }, config));

    config = this.config;

    this.format = function(context) {

        if (config.stringifyMessage) {
            context.message = self.stringifyMessage(context.message);
        }

        var values = self.prepare(context);
        return JSON.stringify(values, null, self.config.pretty ? 4 : 0);
    }

}


/* Inherit BaseFormatter */
inherits(JSONFormatter, (require('./_base')) );

