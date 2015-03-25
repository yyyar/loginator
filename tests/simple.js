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


        setTimeout(function() {
            log.info('hello', new Error('some err'), {'some object': new Date()});
            test.done();
        }, 500);

    }
}

