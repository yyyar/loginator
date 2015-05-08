/**
 * file.js - file appender
 */

var _ = require('lodash'),
    fs = require('fs'),
    inherits = require('util').inherits;

/**
 * Cache of shared streams
 */
var streams = {};


/* modules exports */

var FileAppender = module.exports = function(config) {

    var self = this;

    FileAppender.super_.call(this, {
        path: null,
        shareStream: true
    });

    this.config = config = _.extend(this.config, config);

    if (!this.config.path) {
        throw Error('options.path is required');
    }


    /* Get stream, new or cached, depending on config */

    var stream = null;

    if (!config.shareStream) {
        stream = fs.createWriteStream(config.path, {flags:'a'});
    } else {
        if (!_.contains(_.keys(streams), config.path)) {
            streams[config.path] = fs.createWriteStream(config.path, {flags:'a'});
            streams[config.path].usedBy = 1;
        } else {
            streams[config.path].usedBy++;
        }

        stream = streams[config.path];
    }


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
    this.close = function() {

        if (!this.config.shareStream) {
            return stream.destroy();
        }

        stream.usedBy--;
        if (stream.usedBy <= 0) {
            stream.destroy();
            delete a[config.path];
        }
    }

};

inherits(FileAppender, (require('./_base')) );
