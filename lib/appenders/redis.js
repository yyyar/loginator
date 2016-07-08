/**
 * redis.js - redis appender
 */

var _ = require('lodash'),
    redis = require('redis'),
    inherits = require('util').inherits;

/* modules exports */
var connections = {},
    usedBy = 0;

var RedisAppender = module.exports = function(config) {

    var self = this;

    /* config */

    RedisAppender.super_.call(this, _.merge({
        // redis client opts
        port: 6379,
        host: 'localhost',
        options: {},

        // appender opts
        namespace: 'default',
        shareConnection: true // always true for now
    }, config));

    config = this.config;

    /* Initialize redis client */

    var connectionKey = config.host + ':' + config.port + ':' + config.namespace,
        client = connections[connectionKey];

    if (!client) {

        client = redis.createClient(config.port, config.host, config.options);
        client.unref();
        client.on('error', function(err) {
            console.log('loginator redis appender error:', err);
        });
        client.usedBy = 1;
        connections[connectionKey] = client;
    } else {
        client.usedBy++;
    }

    /**
     * Write message
     */
    this.performWrite = function(data) {
        // publish to redis removing last newline char
        if (client) {
            client.publish('loginator:' + self.config.namespace, data);
        } else {
            console.warn('Write attempt to closed redis appender %s:%d {%s}', self.config.host, self.config.port, self.config.namespace);
        }
    };

    /**
     * Close appender
     */
    this.close = function() {
        if (--client.usedBy <= 0) {
            client.quit(true);
            delete connections[connectionKey];
            client = null;

        }
    };

};


inherits(RedisAppender, (require('./_base')) );
