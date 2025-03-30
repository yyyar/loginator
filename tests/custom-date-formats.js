/**
 * custom-date-formats.js - Tests for custom date formats
 */

var loginator = require('../lib/logger');

/* module exports */

module.exports = {
    /**
     * Custom date formats
     */
    customFormats: function(test) {

        var log1 = loginator.createLogger({
            name: 'default-formats',
            formatter: {
                type: 'text',
                options: {
                    pattern: 'Date: %date Time: %time Combined: %dtime',
                    dateFormat: 'yyyy-mm-dd',
                    timeFormat: 'HH:MM:ss',
                    dtimeFormat: 'yyyy-mm-dd HH:MM:ss'
                }
            }
        });

        var log2 = loginator.createLogger({
            name: 'custom-formats',
            formatter: {
                type: 'text',
                options: {
                    pattern: 'Date: %date Time: %time Combined: %dtime',
                    dateFormat: 'dd/mm/yyyy',
                    timeFormat: 'HH:MM',
                    dtimeFormat: 'dd/mm/yyyy HH:MM'
                }
            }
        });

        var log3 = loginator.createLogger({
            name: 'json-formats',
            formatter: {
                type: 'json',
                options: {
                    fields: ['date', 'time', 'dtime'],
                    dateFormat: 'mm/dd/yy',
                    timeFormat: 'h:MM TT',
                    dtimeFormat: 'mm/dd/yy h:MM TT'
                }
            }
        });

        var log4 = loginator.createLogger({
            name: '12hour-format',
            formatter: {
                type: 'text',
                options: {
                    pattern: 'Time12: %time',
                    timeFormat: 'h:MM:ss TT'
                }
            }
        });

        var log5 = loginator.createLogger({
            name: 'full-12hour-format',
            formatter: {
                type: 'text',
                options: {
                    pattern: 'Date: %date Time: %time DateTime: %dtime',
                    dateFormat: 'mm/dd/yyyy',
                    timeFormat: 'h:MM TT',
                    dtimeFormat: 'mm/dd/yyyy h:MM TT'
                }
            }
        });

        var log6 = loginator.createLogger({
            name: 'explicit-24hour-format',
            formatter: {
                type: 'text',
                options: {
                    pattern: 'Time24: %time DateTime24: %dtime',
                    timeFormat: 'HH:MM:ss',
                    dtimeFormat: 'yyyy-mm-dd HH:MM:ss'
                }
            }
        });

        // Default formatter should use our configured formats
        // Log something to test
        log1.info('Test default formats');
        log2.info('Test custom formats');
        log3.info('Test JSON formats');
        log4.info('Test 12-hour format');
        log5.info('Test full 12-hour format with AM/PM');
        log6.info('Test explicit 24-hour format');

        // Close loggers
        log1.close();
        log2.close();
        log3.close();
        log4.close();
        log5.close();
        log6.close();

        test.done();
    }
};