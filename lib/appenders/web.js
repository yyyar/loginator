/**
 * web.js - web request appender
 */

var _ = require('lodash'),
    request = require('request'),
    inherits = require('util').inherits;


/* modules exports */

var WebAppender = module.exports = function(config) {

    var self = this;

    this.config = config = _.extend({
        url: null, // required
        method: 'GET',
        headers: {}
    }, config);

    WebAppender.super_.call(this, this.config);

    /**
     * Write
     */
    this.performWrite = function(data) {

        request({
            method: self.config.method,
            uri: self.config.url,
            headers: self.config.headers,
            body: data,
            json: true
        }, function(err, response, body) {
            if (err) {
                // do nothing
            }
        });

    }

    /**
     * Close.
     * Not closing stdout
     */
    this.close = function() {}

}


inherits(WebAppender, (require('./_base')) );
