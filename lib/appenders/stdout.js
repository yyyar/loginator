/**
 * stdout.js - stdout appender
 */

var _ = require('lodash'),
    inherits = require('util').inherits;


/* modules exports */

var StdoutAppender = module.exports = function(config) {

    var self = this;

    this.config = config = _.extend({}, config);
    StdoutAppender.super_.call(this, this.config);

    /**
     * Write
     */
    this.write = function(data) {
        if (self.hasOwnFormatter) {
            data = self.formatter.format(data);
        }
        process.stdout.write(data + '\n');
    }

    /**
     * Close.
     * Not closing stdout
     */
    this.close = function() {}

}



inherits(StdoutAppender, (require('./_base')) );
