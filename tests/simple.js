/**
 * simple.js - simple test
 */

var ilog = require('../lib');


/* module exports */

module.exports = {

    /**
     * Simple test
     */
    simple: function(test) {

        var log = ilog.createLogger('simple', {
            level: 'DEBUG',

            // default formatter
            formatter: ilog.createFormatter('text', {
                pattern: '[%level] %dtime ~ %message'
            }),
            appenders: [
                ilog.createAppender('stdout', {}),
                /*
                ilog.createAppender('redis', {
                    formatter: ilog.createFormatter('json')
                }),
                */
                ilog.createAppender('stdout', {
                    formatter: ilog.createFormatter('json', {
                        fields: ['message', 'dtime'],
                        pretty: true
                    })
                })
            ]
        });


        setTimeout(function() {
            log.info('hello', new Error('some err'), {"myDate":new Date()});
            test.done();
        }, 500);

    }
}

