/**
 * Text formatter
 */

var _ = require('lodash'),
    inherits = require('util').inherits;

/**
 * Text formatter
 */
var TextFormatter = module.exports = function(config) {

    var self = this;

    var pattern2fields = function(pattern) {
        return _.map(pattern.match(/(%[a-z]+)/gi), function(val) { return val.slice(1); });
    }

    var defaultConfig = {
        pattern: '%dtime - %message'
    };
    defaultConfig.fields = pattern2fields(defaultConfig.pattern);

    TextFormatter.super_.call(this, defaultConfig);

    this.config = config = _.extend(this.config, config);
    this.config.fields = config.fields = pattern2fields(config.pattern);


    this.format = function(context) {
        var values = self.prepare(context);
        values['message'] = _.map( values['message'], function(o) {

            if (o instanceof Error) {
                return o.toString();
            }

            if (_.isObject(o)) {
                return JSON.stringify(o);
            }

            return o;
        }).join(' ');

        if (context.limitMessageLength !== 0 && values['message'].length > context.limitMessageLength) {
            values['message'] = values['message'].slice(0, context.limitMessageLength) + '...';
        }

        var finalMsg = _.reduce(values, function(output, val, key) {
            return output.replace('%' + key, val);
        }, self.config.pattern);

        return finalMsg;
    }
}


/* Inherit BaseFormatter */
inherits(TextFormatter, (require('./_base')) );

