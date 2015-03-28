/**
 * file.js - file appender
 */

var _ = require('lodash'),
    fs = require('fs'),
    inherits = require('util').inherits;


/* modules exports */

var FileAppender = module.exports = function(config) {

    var self = this;

    FileAppender.super_.call(this, {
        path: null,
    });

    this.config = config = _.extend(this.config, config);

    if (!this.config.path) {
        throw Error('options.path is required');
    }

    var stream = fs.createWriteStream(config.path, {flags:'a'});

    /**
     * Write message
     */
    this.write = function(data) {
        if (self.hasOwnFormatter) {
            data = self.formatter.format(data);
        }
        stream.write(data + '\n');
    }

    /**
     * Close appender
     */
    this.close = _.bind(stream.destroy, stream);

};

inherits(FileAppender, (require('./_base')) );
