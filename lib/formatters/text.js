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

    TextFormatter.super_.call(this, {
        pattern: '%dtime - %message',
        fields: ['message', 'date', 'dtime', 'time', 'level', 'process', 'name', 'location']
    });

    this.config = config = _.extend(this.config, config);

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
    pattern: '%dtime : %message'
});

console.log(f.format({message:"helo"}));
