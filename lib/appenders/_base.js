 /**
 * base.js - Base appender
 */
var _ = require('lodash');

/**
 * Base appender
 */
var BaseAppender = module.exports = function(config) {

    this.formatter = null;

    this.config = config = _.extend({
        formatter: null
    }, config || {});

    if (this.config.formatter) {
        this.formatter = new (require('../formatters/' + this.config.formatter.type))(this.config.formatter.options);
    }

};


Object.defineProperty(BaseAppender.prototype, "hasOwnFormatter", { 
    get: function () {
        return this.formatter !== null
    }
});

