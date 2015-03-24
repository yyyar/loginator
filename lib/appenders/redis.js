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

    RedisAppender.super_.call(this, {
        port: 6379,
        host: 'localhost',
        options: {},
        namespace: 'default',
        source: 'default'
    });

    this.config = config = _.extend(this.config, config);

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

        if (self.hasOwnFormatter) {
            data = self.config.formatter.format(data);
        }

        // publish to redis removing last newline char
        client.publish('ilog:' + self.config.namespace + ':' + self.config.source, data);
    };

    /**
     * Close appender
     */
    this.close = function() {
        client.close();
    };

};


inherits(RedisAppender, (require('./base')) );
