/**
 * index.js - simple custom logger
 *
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var _ = require('lodash'),
    df = require('dateformat');
    format = require('util').format;


/* Configuration for the process */

var configuration = {
    'level': 'DEBUG',
    'limitMessageLength': Infinity,
    'formatter': new (require('./formatters/text'))({
        'pattern': '%dtime [%level] [%process] (%name) : %message'
    }),
    'appenders': [
        new (require('./appenders/stdout'))()
    ]
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
 * Format message and write
 */
Logger.prototype.message = function(level, msg) {

    var self = this;

    // level indent. todo: replace with proper printf
    level = level.slice(0, MAX_LEVEL_LENGTH) + Array(MAX_LEVEL_LENGTH-level.length).join(' ');
    if (msg.length > this.config.limitMessageLength) {
        msg = msg.slice(0, this.config.limitMessageLength) + '...';
    }

    var output = this.config.formatter.format({
        message: msg,
        name: self.name,
        level: level
    });

    // Write to appenders
    _.each(this.config.appenders, function(appender) {
        appender.write(output);
    });
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

        this.message(level, _.toArray(arguments));
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

