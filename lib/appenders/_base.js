 /**
 * base.js - Base appender
 */
var _ = require('lodash');

/**
 * Base appender
 */
var BaseAppender = module.exports = function(config) {

    var self = this;

    this.formatter = null;

    this.config = config = _.extend({
        formatter: null,
        level: null
    }, config || {});

    if (this.config.formatter) {
        this.formatter = new (require('../formatters/' + this.config.formatter.type))(this.config.formatter.options);
    };

    this.write = function(o) {
        if (self.formatter) {
            o = self.formatter.format(o);
        }
        self.performWrite(o);
    };

    this.close = function() {};
};


Object.defineProperty(BaseAppender.prototype, 'hasOwnFormatter', {
    get: function () {
        return this.config.formatter !== null;
    }
});

Object.defineProperty(BaseAppender.prototype, 'level', {
    get: function () {
        return this.config.level;
    }
});
