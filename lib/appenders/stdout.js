/**
 * stdout.js - stdout appender
 */

var _ = require('lodash');


/* modules exports */

module.exports = function(config) {

    /**
     * Write
     */
    this.write = function(data) {
        process.stdout.write(data + '\n');
    }

    /**
     * Close.
     * Not closing stdout
     */
    this.close = function() {}

}

