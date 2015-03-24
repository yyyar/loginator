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
            'formatter': new (require('../lib/formatters/json'))()
        });


        log.info('hello', new Error('some err'), {"myDate":new Date()});
        test.done();

    }
}

