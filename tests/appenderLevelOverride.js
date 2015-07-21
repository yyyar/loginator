/**
 * appenderLevelOverride.js - appender level override sample
 */

var loginator = require('../lib/logger');


/* module exports */

module.exports = {

    /**
     * Level override example
     */
    levelOverride: function(test) {

        var log = loginator.createLogger({

            name: 'mylogger',

            // default logging level
            level: 'FATAL',

            // default formatter
            formatter: {
                type: 'text',
                options: {
                    pattern: '[%level] %dtime (%name) (%location) ~ %message'
                }
            },

            // appenders
            appenders: [

                {
                    type: 'stdout'
                },
                {
                    type: 'stdout',
                    level: 'ERROR',
                    options: {}
                }
            ]
        });


        log.info('Info'); // prints 0 times
        log.error('Error'); // 1 times
        log.fatal('Fatal'); // 2 times
        test.done();

    }
}

