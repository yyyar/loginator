/**
 * file.js - file appender
 */

var _ = require('lodash'),
    fs = require('fs'),
    inherits = require('util').inherits;

/**
 * Cache of shared streams
 */
var streams = {},
    MAX_STAT_INVOCATIONS = 100,
    statInvocationCounter = MAX_STAT_INVOCATIONS;


/* modules exports */

var FileAppender = module.exports = function(config) {

    var self = this;

    FileAppender.super_.call(this, {
        path: null,
        rollingSize: null
    });

    this.config = config = _.extend(this.config, config);


    /* calculate rollingSize size */

    if (config.rollingSize) {
        var r = config.rollingSize.match(/(\d+)(b|kb|mb|gb)?/),
            unit = r[2] || 'b',
            size = r[1];

        if (!size) {
            throw Error('Invalid rollingSize parameter: ' + config.rollingSize);
        }

        config.rollingSize = {
            'b': 1,
            'kb': 1024,
            'mb': 1024 * 1024,
            'gb': 1024 * 1024
        }[unit] * size;
    }


    /* check path */

    if (!this.config.path) {
        throw Error('options.path is required');
    }


    /* Get stream, new or cached, depending on config */

    if (!_.contains(_.keys(streams), config.path)) {
        streams[config.path] = fs.createWriteStream(config.path, {flags:'a'});
        streams[config.path].usedBy = 1;
    } else {
        streams[config.path].usedBy++;
    }


    /**
     * Write message
     */
    this.performWrite = function(data) {

        if (this.config.rollingSize) {
            this.rollover(data.length);
        }

        var stream = streams[config.path];
        stream.write(data + '\n');
    }

    /**
     * Perfrom logs rollover if needed
     */
    this.rollover = function(slen) {

        if (statInvocationCounter++ < MAX_STAT_INVOCATIONS) {
            return;
        }

        statInvocationCounter = 0;

        var stream = streams[config.path],
            stats = fs.statSync(config.path);

        if (stats.size + slen > config.rollingSize) {
            stream.close();
            fs.renameSync(config.path, config.path + '.1');
            var usedBy = stream.usedBy;
            streams[config.path] = fs.createWriteStream(config.path, {flags:'a'});
            streams[config.path].usedBy = usedBy;
        }

    };

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
