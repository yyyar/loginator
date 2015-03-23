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

    JSONFormatter.super_.call(this, {
        pretty: true,
        fields: ['message', 'date', 'dtime', 'time', 'level', 'process', 'name', 'location']
    });

    this.config = config = _.extend(this.config, config);

    this.format = function(context) {
        var values = self.prepare(context);
        return JSON.stringify(values, null, self.config.pretty ? 4 : 0);
    }

}


/* Inherit BaseFormatter */
inherits(JSONFormatter, (require('./base')) );


var f = new JSONFormatter({
    fields: ['message', 'process']
});
console.log(f.format({message:"helo"}));
