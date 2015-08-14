/**
 * redis.js - redis appender
 */

var _ = require('lodash'),
    redis = require('redis'),
    inherits = require('util').inherits;

/* modules exports */

var RedisAppender = module.exports = function(config) {

    var self = this;

    /* config */

    RedisAppender.super_.call(this, _.merge({
        port: 6379,
        host: 'localhost',
        options: {},
        namespace: 'default'
    }, config));

    config = this.config;

    /* Initialize redis client */

    var client = redis.createClient(config.port, config.host, config.options);
    client.unref();

    client.on('error', function(err) {
        console.log('Error', err);
    });


    /**
     * Write message
     */
    this.performWrite = function(data) {
        // publish to redis removing last newline char
        client.publish('loginator:' + self.config.namespace, data);
    };

    /**
     * Close appender
     */
    this.close = function() {
        client.close();
    };

};


inherits(RedisAppender, (require('./_base')) );
