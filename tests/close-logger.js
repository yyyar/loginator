/**
 * simple.js - simple test
 */

var loginator = require('../lib/logger'),
    file_cfg = {
        appenders: [{
            type: 'file',
            options: {
                path: __dirname + '/output/log.log',
                rollingSize: '5b',
            }
        }]
    },
    redis_cfg = {
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
    },
    web_cfg = {
        appenders: [
            {
                type: 'web',
                level: 'DEBUG',
                options: {

                    formatter: {
                        type: 'json'
                    },

                    url: 'http://localhost:3333',
                    method: 'POST'
                }
            }]
    };


/* module exports */

module.exports = {

    /**
     * Closable file appender test
     */
    file: function (test) {

        var log = loginator.createLogger(file_cfg),
            log2 = loginator.createLogger(file_cfg);

            log.debug('Hello world!');
            log2.debug('Hello world logger2!');
            log.close();
            log2.debug('Bye world logger2!');
            log2.close();
            log2.close();
            log2.debug('sdfse');

            test.done();
    },
    redis: function (test) {
        var log = loginator.createLogger(redis_cfg),
            log2 = loginator.createLogger(redis_cfg);

        log.debug('Hello world!');
        log2.debug('Hello world logger2!');
        log.close();
        log2.debug('Bye world logger2!');
        log2.close();
        log2.debug('sdfse');
        test.done();
    },
    stdout: function (test) {

        var log = loginator.createLogger("simple1"),
            log2 = loginator.createLogger("simple2");

        log.debug('Hello world!');
        log2.debug('Hello world logger2!');
        log.close();
        log2.debug('Bye world logger2!');
        log2.close();
        log2.debug('sdfse');
        test.done();
    },
    web: function (test) {
        var log = loginator.createLogger(web_cfg);

        var http = require('http');
        var cnt = 0;
        var server = http.createServer(function (req, res) {
            res.end();
            cnt += 1;
            if (cnt >= 3) {
                server.close();
                test.done();
            }
        }).listen(3333, '127.0.0.1');

        log.info('Info world!');
        log.error('Error world!');
        log.close();
        log.error('Error world!');

    }

};
