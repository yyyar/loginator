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
            appenders: [{
                type: 'redis',
                level: 'ERROR',
                options: {
                    host: 'localhost',
                    port: 6379,
                    namespace: '123',
                    formatter: {
                        type: 'json',
                        options: {
                            stringifyMessage: false,
                            fields: ['message', 'dtime', 'process', 'hostname', 'name']
                        }
                    }
                }
            }]
        });

        // Naive wait for redis appender to connect
       setTimeout(function() {
            log.info('Hello world!');
            log.error('errr', {object: 'value'});
            test.done();
       }, 1000);

    }
}

