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
    MAX_STAT_INVOCATIONS = 82;


/* modules exports */

var FileAppender = module.exports = function(config) {

    var self = this;

    FileAppender.super_.call(this, {
        path: null,
        rollingSize: null
    });

    this.config = config = _.extend(this.config, config);

    /* sync open write stream */
    function openStreamSync(path) {
        return fs.createWriteStream(null, {fd: fs.openSync(path, 'a')});
    }

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

    if (!_.includes(_.keys(streams), config.path)) {
        streams[config.path] = openStreamSync(config.path);
        streams[config.path].usedBy = 1;
    } else {
        streams[config.path].usedBy++;
    }

    streams[config.path].statInvocationCounter = MAX_STAT_INVOCATIONS;

    /**
     * Write message
     */
    this.performWrite = function(data) {

        if (!streams[config.path]) {
            return this.config.loglog('Write attempt to closed appender', self.config.path);
        }

        if (this.config.rollingSize) {
            this.rollover(data.length);
        }

        streams[config.path].write(data + '\n');
    };

    /**
     * Perfrom logs rollover if needed
     */
    this.rollover = function(slen) {

        if (streams[self.config.path].statInvocationCounter++ < MAX_STAT_INVOCATIONS) {
            return;
        }

        streams[self.config.path].statInvocationCounter = 0;

        var stream = streams[config.path],
            stats = fs.statSync(config.path);

        if (stats.size + slen > config.rollingSize) {
            stream.close();
            fs.renameSync(config.path, config.path + '.1');

            var usedBy = stream.usedBy;
            var statInvocationCounter = stream.statInvocationCounter;

            streams[config.path] = openStreamSync(config.path);
            streams[config.path].usedBy = usedBy;
            streams[config.path].statInvocationCounter = 0;

        }

    };

    /**
     * Close appender
     */
    this.close = function() {
        var stream = streams[config.path];
        if (!stream) {
            return this.config.loglog('Close attempt to closed appender', self.config.path);
        }

        stream.usedBy--;
        if (stream.usedBy <= 0) {
            stream.destroy();
            delete streams[config.path];
        }
    };

};

inherits(FileAppender, (require('./_base')) );
