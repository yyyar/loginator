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
            'level': 'DEBUG',
            'format': 'text',
            'pattern': '%dtime [%level] [%process] (%name) : %message',
            'appenders': [
                ilog.createAppender('stdout')
                //ilog.createAppender('redis', {
                //    port: 6379,
                //    host: 'localhost',
                //    namespace: 'mycompany',
                //    source: 'server1'
                //})
            ]
        });


        log.info('hello', {"key":new Date()});
        test.done();

    }
}

