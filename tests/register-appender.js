/**
 * registerAppender.js - configuration sample
 */

var loginator = require('../lib/logger');


/* module exports */

module.exports = {

    /**
     * Register appender example
     */
    registerAppender: function(test) {

        /* Register your custom appender first */
        loginator.registerAppender('customAppender', require(__dirname + '/custom/customAppender'));

        /* Now use it in configuration in the same way as build-in */
        var log = loginator.createLogger({

            appenders: [
                {
                    type: 'customAppender',
                    level: 'ERROR'
                },
                {
                    type: 'stdout',
                    level: 'INFO'
                }
            ]
        });


        log.info('INFO'); // prints one
        log.error('ERROR'); // prints 2 times

        test.done();

    }
}

