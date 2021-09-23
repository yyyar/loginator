/**
 * custom-variables.js - custom variables test
 */

var loginator = require('../lib/logger');


/* module exports */

module.exports = {

    /**
     * Custom variables test
     */
    customVariables: function(test) {

        var log = loginator.createLogger({
            customVars: {
                'myVar': 'nothing'
            },
            formatter: {
                type: 'text',
                options: {
                    pattern: '%dtime (%myVar): %message'
                }
            }
        });

        var boundLog = log.bind({
            'myVar': 'MY1'
        });

        var boundLog2 = log.bind({
            'myVar': 'MY2'
        });

        log.info('Not bound');
        boundLog.info('Bound 1');
        boundLog2.info('Bound 2');

        log.with({myVar:'WITHONCE'}).info("With once");
        log.info("After with once");

        test.done();

    }
}

