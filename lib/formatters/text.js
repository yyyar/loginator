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
        pattern: '%dtime - %message',
    };
    defaultConfig.fields = pattern2fields(defaultConfig.pattern);

    TextFormatter.super_.call(this, defaultConfig);

    this.config = config = _.extend(this.config, config);
    this.config.fields = config.fields = pattern2fields(config.pattern);

    config.fields = _.union(['customVars'], config.fields);

    this.format = function(context) {
        var values = self.prepare(context);

        values['message'] = self.stringifyMessage(values['message']);

        if (context.limitMessageLength !== 0 && values['message'].length > context.limitMessageLength) {
            values['message'] = values['message'].slice(0, context.limitMessageLength) + '...';
        }

        var finalMsg = _.reduce(values, function(output, val, key) {

            if (key != 'customVars') {
                return output.replace('%' + key, val);
            }

            return _.reduce(val, function(output, val, key) {
                return output.replace('%' + key, val);
            }, output);

        }, self.config.pattern);

        return finalMsg;
    }
}


/* Inherit BaseFormatter */
inherits(TextFormatter, (require('./_base')) );

