/**
 * file.js - file output test
 */

var loginator = require('../lib/logger');


/* module exports */

module.exports = {

    /**
     * File output test
     */
    file: function(test) {

        var log = loginator.createLogger({
            appenders: [{
                type: 'file',
                options: {
                    path: __dirname + '/output/log.log',
                    shareStream: true
                }
            }]
        }),
        log2 = loginator.createLogger({
            appenders: [{
                type: 'file',
                options: {
                    path: __dirname + '/output/log.log',
                    shareStream: true
                }
            }]
        });

        log.info('Hello world!');
        log2.info('Hello world2!');

        test.done();

    }
}

