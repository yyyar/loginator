/**
 * stdout.js - stdout appender
 */

var _ = require('lodash'),
    inherits = require('util').inherits;


/* modules exports */

var StdoutAppender = module.exports = function(config) {

    var self = this;

    StdoutAppender.super_.call(this, {
        name: 'default',
        path: '/tmp',
        namespace: 'default'
    });

    this.config = config = _.extend(this.config, config);

    /**
     * Write
     */
    this.write = function(data) {
        if (self.hasOwnFormatter) {
            data = self.config.formatter.format(data);
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
