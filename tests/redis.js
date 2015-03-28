/**
 * redis.js - redis output test
 */

var loginator = require('../lib/logger');


/* module exports */

module.exports = {

    /**
     * Redis output test
     */
    redis: function(test) {

        var log = loginator.createLogger({
            formatter: {
                type: 'json'
            },
            appenders: [{
                type: 'redis',
                options: {
                    host: 'localhost',
                    port: 6379,
                    options: {}
                }
            }]
        });

        // Naive wait for redis appender to connect
       setTimeout(function() {
            log.info('Hello world!');
            test.done();
       }, 1000);

    }
}

