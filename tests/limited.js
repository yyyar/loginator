/**
 * limited.js - limit message test
 */

var loginator = require('../lib/logger');


/* module exports */

module.exports = {

    /**
     * Limit message test
     */
    simple: function(test) {

        var log = loginator.getLogger('simple', {
            limitMessageLength: 5
        });

        log.debug('123456789');

        test.done();

    }
};

