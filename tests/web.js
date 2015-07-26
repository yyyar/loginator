/**
 * web.js - web output test
 */

var loginator = require('../lib/logger');


/* module exports */

module.exports = {

    /**
     * Redis output test
     */
    redis: function(test) {

        var log = loginator.createLogger({
            appenders: [
            {
                type: 'stdout',
                level: 'DEBUG'
            },
            {
                type: 'web',
                level: 'ERROR',
                options: {

                    formatter: {
                        type: 'json'
                    },

                    url: 'http://localhost:3333',
                    method: 'POST'
                }
            }]
        });

        var http = require('http');
        var server = http.createServer(function (req, res) {
          req.on('data', function(d) { console.log('Got request with data: ' + d.toString()); });
          res.end();
          server.close();
          test.done();
        }).listen(3333, '127.0.0.1');

       log.info('Info world!');
       log.error('Error world!');

    }
}

