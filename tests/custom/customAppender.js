/**
 * customAppender.js - custom appender appender
 */

var _ = require('lodash'),
    inherits = require('util').inherits;


/* modules exports */

var CustomAppender = module.exports = function(config) {

    var self = this;

    CustomAppender.super_.call(self, _.extend({
        // defaults
    }, config));

    config = self.config;

    /**
     * Perform write already formatter data
     */
    self.performWrite = function(data) {
        process.stdout.write('CUSTOM APPENDER! ' + data + '\n');
    }

    /**
     * Close
     */
    self.close = function() {}

}


inherits(CustomAppender, (require('../../lib/logger').BaseAppender) );
