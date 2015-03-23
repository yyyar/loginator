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
        return _.reduce(values, function(output, val, key) {
            return output.replace('%' + key, val);
        }, this.config.pattern);
    }
}


/* Inherit BaseFormatter */
inherits(TextFormatter, (require('./base')) );


var f = new TextFormatter({
    pattern: '%dtime [%process] : %message'
});

console.log(f.format({message:"helo"}));
