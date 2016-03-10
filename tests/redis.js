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

        var config = {
            appenders: [{
                type: 'redis',
                level: 'DEBUG',
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
        };

        var log = loginator.getLogger('log1', config);
        var log2 = loginator.getLogger('log2', config);

        // Naive wait for redis appender to connect
       setTimeout(function() {
       //setInterval(function() {
            log.info('Hello world 1!', {object: 'value'});
            log2.info('Hello world 2!', {object: 'value'});
            test.done();
       }, 1000);

    }
}

