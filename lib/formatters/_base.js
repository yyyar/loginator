/**
 * base.js - Base formatter
 */
var _ = require('lodash'),
    df = require('dateformat'),
    os = require('os');

/**
 * Base formatter
 */
var BaseFormatter = module.exports = function(config) {

    this.config = config = _.extend({
        level: 'DEBUG',
        fields: config.fields ? [] : ['message', 'dtime', 'process'],
        dateFormat: 'yyyy-mm-dd',
        timeFormat: 'HH:MM:ss',
        dtimeFormat: 'yyyy-mm-dd HH:MM:ss'
    }, config || {} );

};

/**
 * Stringify logging message
 */
BaseFormatter.prototype.stringifyMessage = function(message) {
    return _.map(message, function(o) {

        if (o instanceof Error) {
            return o.toString();
        }

        if (_.isObject(o)) {
            return JSON.stringify(o);
        }

        return o;
    }).join(' ');
}

/**
 * Returns bindings object with values
 */
BaseFormatter.prototype.bindings = function(context) {
    var self = this;
    return _.extend(context, {
        'message': context.message,
        'date': function() { return df(self.config.dateFormat) },
        'dtime': function() { return df(self.config.dtimeFormat) },
        'time': function() { return df(self.config.timeFormat) },
        'level': context.level,
        'limitMessageLength': context.limitMessageLength,
        'process': process.title,
        'name': context.name,
        'hostname': os.hostname(),
        'location': null
    })
};

/**
 * Prepares formatter values
 */
BaseFormatter.prototype.prepare = function(context) {

    var self = this;
    var bindings = self.bindings(context);

    var values = {};
    _.each(this.config.fields, function(field) {
        var value = _.isFunction(bindings[field]) ? bindings[field]() : bindings[field]
        values[field] = value;

        // not to consume much resources
        // calculate location only if needed
        if (field == 'location' || field == 'longlocation') {
            var stack = context.locationStack.split('\n').slice(3)[0],
                where = stack.match(/\((.*?)\)/);

            // If called from function expression, stack format differs
            // and we need to perform different matching
            if (where) {
                where = where[1].split(':');
            } else {
                where = stack.match(/.*?at (.*?)$/)[1].split(':')
            }

            values[field] = (field == 'location'
                           ? where[0].split('/').slice(-1)[0]
                           : where[0]) + ':' + where[1];
        }
    });

    return values;
}


