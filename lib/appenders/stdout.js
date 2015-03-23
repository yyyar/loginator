/**
 * stdout.js - stdout appender
 */

var _ = require('lodash');


/* modules exports */

module.exports = function() {

    /**
     * Write
     */
    this.write = _.bind(process.stdout.write, process.stdout);

    /**
     * Close.
     * Not closing stdout
     */
    this.close = function() {}

}

