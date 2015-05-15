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

        var log = loginator.getLogger('simple');

        log.debug('Hello world!');
        log.info('Hello world!');
        log.warn('Hello world!');
        log.error('Hello world!');
        log.fatal('Hello world!');

        log.info('Hello world!', {'some': 'object'}, new Date(), new Error('Error!!!'));

        test.done();

    }
};

