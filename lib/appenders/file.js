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
        name: 'default',
        path: '/tmp',
        namespace: 'default'
    });

    this.config = config = _.extend(this.config, config);

    if (!fs.existsSync(config.path)) {
        fs.mkdirSync(opts.logsDir);
    } else {
        sysLog.info('Logs dir for', cid, 'exists', opts.logsDir);
    }

    var stream = fs.createWriteStream(config.path + '/' + config.name + '.log', {flags:'a'});

    /**
     * Write message
     */
    this.write = function(data) {
        if (self.hasOwnFormatter) {
            data = self.config.formatter.format(data);
        }
        stream.write(data + '\n');
    }

    /**
     * Close appender
     */
    this.close = _.bind(stream.destroy, stream);

};

inherits(FileAppender, (require('./base')) );
