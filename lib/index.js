/**
 * index.js - simple custom logger
 *
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var _ = require('lodash'),
    df = require('dateformat');
    format = require('util').format,


/* Configuration for the process */

var configuration = {
    'level': 'DEBUG',
    'format': 'text', // 'text' or 'json'
    'pattern': '%dtime [%level] [%process] (%name) : %message',
    'limitMessageLength': Infinity,
    'appenders': [process.stdout]
};


/**
 * Constants
 */

var MAX_LEVEL_LENGTH = 6;

/**
 *  logging levels priority 
 */
var levels = {
    'MIN'   :  0,
    'TRACE' : 10,
    'DEBUG' : 20,
    'INFO'  : 30,
    'WARN'  : 40,
    'ERROR' : 50,
    'FATAL' : 60,
    'MAX'   : 70
};


/* Logger Constructor */

var Logger = function(name, config) {
    this.name = name || '';
    this.config = _.merge(configuration, config || {});
};


/* Methods */

/**
 * Write message to appenders
 */
Logger.prototype.write = function(data) {
    _.each(this.config.appenders, function(stream) {
        stream.write(data);
    });
};


/**
 * Format message and write
 */
Logger.prototype.message = function(level, msg) {

    // level indent. todo: replace with proper printf
    level = level.slice(0, MAX_LEVEL_LENGTH) + Array(MAX_LEVEL_LENGTH-level.length).join(' ');
    if (msg.length > this.config.limitMessageLength) {
        msg = msg.slice(0, this.config.limitMessageLength) + '...';
    }

    // file and line location (if needed)
    var location = '';
    if (_.contains(this.config.pattern, '%location')) {
        var stack = (new Error()).stack.split('\n').slice(3)[0],
            where = stack.match(/\((.*?)\)/)[1].split(':');
        location = where[0].split('/').slice(-1)[0] + ':' + where[1];
    }

    var bindings = {
        '%message': msg,
        '%date': df('yyyy-mm-dd'),
        '%dtime': df('yyyy-mm-dd hh:MM:ss'),
        '%time': df('hh:MM:ss'),
        '%level': level,
        '%process': process.title,
        '%name': this.name,
        '%location': location
    }

    var output = '';

    if (this.config.format === 'text') {

        output = this.config.pattern;
        _.each(bindings, function(val, key) {
            output = output.replace(key, val);
        });

    } else if (this.config.format === 'json') {

        output = {};
        _.each(bindings, function(val, key) {
            output[key.slice(1)] = val;
        });
        output = JSON.stringify(output)

    } else {
        throw new Error('Wrong config format: ' + this.config.format);
    }

    // Write to appenders
    this.write( output + '\n' );
};


/*
 * Bind log functions according to configured level 
 */
_.forEach(levels, function(weight, level) {

    Logger.prototype[level.toLowerCase()] = function() {

        var self = this;

        // Skip if level does not match
        if (weight < levels[self.config.level]) {
            return;
        }

        // Simple proceed if format is json
        if (self.config.format === 'json') {
            return self.message(level, arguments);
        }

        // Deal with different args types if format is text
        var args = _.map(arguments, function(o) {

            if (o instanceof Error) {
                return o.toString();
            }

            if (_.isObject(o)) {
                return JSON.stringify(o);
            }

            return o;
        });

        this.message(level, args.join(' '));
    };

});


/* exports */

module.exports = {

    /**
     * Globlal configuration (default)
     */
    configure: function(config) {
        configuration = _.merge(configuration, config);
    },

    /**
     * Create logger (and override config, if needed)
     */
    createLogger: function(name, config) {
        return new Logger(name, config);
    },

    /**
     * Create appender
     */
    createAppender: function(type, config) {
        return new (require(__dirname + '/appenders/' +type))(config);
    }

};

