/**
 * configurated.js - configuration sample
 */

var loginator = require('../lib/logger');


/* module exports */

module.exports = {

    /**
     * Configuration example
     */
    configurated: function(test) {

        var log = loginator.createLogger({

            name: 'mylogger',

            // default logging level
            level: 'DEBUG',

            // default formatter
            formatter: {
                type: 'text',
                options: {
                    pattern: '[%level] %dtime ~ %message'
                }
            },

            // appenders
            appenders: [

                // uses default formetter
                {
                    type: 'stdout'
                },

                // overrides default formatter
                {
                    type: 'stdout',
                    options: {
                        formatter: {
                            type: 'json',
                            options: {
                                fields: ['message', 'dtime'],
                                pretty: true
                            }
                        }
                    }
                }
            ]
        });


        log.info('hello', new Error('some err'), {'some object': new Date()});
        test.done();

    }
}

