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
    name: 'default',
    level: 'DEBUG',
    limitMessageLength: 0,
    formatter: {
        type: 'text',
        options: {
            pattern: '%dtime [%level] [%process] (%name) : %message'
        }
    },
    appenders: [{
        type: 'stdout',
        options: {}
    }]
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

var Logger = function(config) {

    this.config = _.extend({}, configuration, config || {});
    this.formatter = new (require(__dirname + '/formatters/'+ this.config.formatter.type))(
        this.config.formatter.options
    );

    this.appenders = _.map(this.config.appenders, function(a) {
        return new (require(__dirname+ '/appenders/' + a.type))(a.options);
    });
};


/* Methods */

/**
 * Format message and write
 */
Logger.prototype.message = function(level, msg) {

    var self = this;

    // level indent. todo: replace with proper printf
    level = level.slice(0, MAX_LEVEL_LENGTH) + Array(MAX_LEVEL_LENGTH-level.length).join(' ');
    if (this.config.limitMessageLength !== 0 && msg.length > this.config.limitMessageLength) {
        msg = msg.slice(0, this.config.limitMessageLength) + '...';
    }

    var context = {
        message: msg,
        name: self.config.name,
        level: level
    };

    var output = this.formatter.format(context);

    // Write to appenders
    _.each(this.appenders, function(appender) {
        appender.write( appender.hasOwnFormatter ? context : output);
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
    createLogger: function(config) {
        return new Logger(config);
    },

    /**
     * Register custom appender
     */
    registerFormatter: function(Formatter) {
        // TODO
    },

    /**
     * Register custom formatter
     */
    registerAppender: function(Appender) {
        // TODO
    }

};

