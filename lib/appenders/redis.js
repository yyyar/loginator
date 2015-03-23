/**
 * redis.js - redis appender
 */

var _ = require('lodash'),
    redis = require('redis');


/* modules exports */

module.exports = function(config) {

    var self = this;

    /* config */

    this.config = config = _.merge({
        port: 6379,
        host: 'localhost',
        options: {},
        namespace: 'default',
        source: 'default'
    }, config);

    /* Initialize redis client */

    var client = redis.createClient(config.port, config.host, config.options);
    client.unref();

    client.on('error', function(err) {
        console.log('Error', err);
    });


    /**
     * Write message
     */
    this.write = function(data) {
        // publish to redis removing last newline char
        client.publish('ilog:' + self.config.namespace + ':' + self.config.source, data.slice(0,-1));
    };

    /**
     * Close appender
     */
    this.close = function() {
        client.close();
    };

};

