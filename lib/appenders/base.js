 /**
 * base.js - Base appender
 */
var _ = require('lodash');

/**
 * Base appender
 */
var BaseAppender = module.exports = function(config) {

    this.config = config = _.extend({
        formatter: null
    }, config || {} );

};


Object.defineProperty(BaseAppender.prototype, "hasOwnFormatter", { 
    get: function () {
        return this.config.formatter !== null 
    }
});

