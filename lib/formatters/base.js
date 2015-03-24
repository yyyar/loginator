/**
 * base.js - Base formatter
 */
var _ = require('lodash'),
    df = require('dateformat');

/**
 * Base formatter
 */
var BaseFormatter = module.exports = function(config) {

    this.config = config = _.extend({
        level: 'DEBUG',
        fields: ['message', 'dtime', 'process']
    }, config || {} );

};



/**
 * Returns bindings object with values
 */
BaseFormatter.prototype.bindings = function(context) {
    return {
        'message': context.message,
        'date': function() { return df('yyyy-mm-dd') },
        'dtime': function() { return df('yyyy-mm-dd hh:MM:ss') },
        'time': function() { return df('hh:MM:ss') },
        'level': context.level,
        'process': process.title,
        'name': context.name,
        'location': context.location
    }
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
    });

    return values;
}


