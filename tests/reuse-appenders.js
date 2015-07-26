/**
 * simple.js - simple test
 */

var loginator = require('../lib/logger');


/* module exports */

module.exports = {

    /**
     * Simple test
     */
    simple: function(test) {

        var stdoutAppender = loginator.createAppender({
            type: 'stdout'
        });

        var log = loginator.createLogger({
            name: 'log',
            appenders: [
                stdoutAppender
            ]
        });

        var log2 = loginator.createLogger({
            name: 'log2',
            appenders: [
                stdoutAppender
            ]
        });

        log.debug('Hello world!');
        log2.debug('Bye world!');

        test.done();
    }
}

