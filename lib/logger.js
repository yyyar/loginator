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
    customVars: {},
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


/**
 * Created loggers cache
 */
var loggers = {
    // name -> logger
};


/**
 * Available Appenders
 */
var BASE_APPENDER = require(__dirname + '/appenders/_base');

var APPENDERS = {
    'stdout': require(__dirname + '/appenders/stdout'),
    'redis': require(__dirname + '/appenders/redis'),
    'file': require(__dirname + '/appenders/file'),
    'web': require(__dirname+ '/appenders/web')
};


/* Logger Constructor */

var Logger = function(config) {

    this.config = _.extend({}, configuration, config || {});
    this.formatter = new (require(__dirname + '/formatters/'+ this.config.formatter.type))(
        this.config.formatter.options
    );

    this.appenders = _.map(this.config.appenders, function(a) {
        if (a instanceof BASE_APPENDER) {
            return a;
        }

        if (!APPENDERS[a.type]) {
            throw new Error('Appender with type ' + a.type + ' is not registered');
        }

        return new (APPENDERS[a.type]) (
            _.merge({}, a.options || {}, {level: a.level})
        );
    });
};


/* Methods */

/**
 * Format message and write
 */
Logger.prototype.message = function(level, msg) {

    var self = this;

    // level indent. todo: replace with proper printf
    formattedLevel = level.slice(0, MAX_LEVEL_LENGTH) + Array(MAX_LEVEL_LENGTH-level.length).join(' ');

    var context = _.merge({
        message: msg,
        name: self.config.name,
        limitMessageLength: this.config.limitMessageLength,
        level: formattedLevel,
        locationStack: new Error().stack
    }, this.config.customVars);

    var output = this.formatter.format(context);

    // Write to appenders
    _.each(this.appenders, function(appender) {
        var allowedLevel = appender.level || self.config.level;
        if (levels[level] < levels[allowedLevel]) {
            return;
        }
        appender.write( appender.hasOwnFormatter ? context : output);
    });
};

Logger.prototype.close = function(){

    _.each(this.appenders, function(appender) {
        appender.close();
    });
};

Logger.prototype.bind = function(vars) {
    var boundLog = Object.create(this);
    boundLog.config = _.extend(_.clone(Object.getPrototypeOf(boundLog).config), {
        customVars: vars
    });
    return boundLog;
};



/*
 * Bind log functions according to configured level 
 */
_.forEach(levels, function(weight, level) {

    Logger.prototype[level.toLowerCase()] = function() {
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
     * Creates or returns existing logger
     */
    getLogger: function(name, config) {
        if (!_.contains(_.keys(loggers), name)) {
            return new Logger( _.merge(config || {}, {name:name}) );
        }
        return loggers[name];
    },

    /**
     * Closes and removes from cache existing logger
     */
    removeLogger: function(name) {
        if (_.contains(_.keys(loggers), name)){
            loggers[name].close();
            delete loggers[name];
        }
    },

    /**
     * Create appender
     */
    createAppender: function(config) {
        return new (require(__dirname + '/appenders/' + config.type))()
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
    registerAppender: function(name, Appender) {
        APPENDERS[name] = Appender;
    },

    /**
     * Base appender to inherit and use in custom appenders
     */
    BaseAppender: BASE_APPENDER

};

