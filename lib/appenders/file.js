/**
 * file.js - file appender
 */

var _ = require('lodash'),
    fs = require('fs');


/* modules exports */

module.exports = function(config) {

    var self = this;

    /* config */

    this.config = config = _.merge({
        name: 'default',
        path: '/tmp',
        namespace: 'default'
    }, config);

    if (!fs.existsSync(config.path)) {
        fs.mkdirSync(opts.logsDir);
    } else {
        sysLog.info('Logs dir for', cid, 'exists', opts.logsDir);
    }

    var stream = fs.createWriteStream(config.path + '/' + config.name + '.log', {flags:'a'});

    /**
     * Write message
     */
    this.write = _.bind(stream.write, stream);

    /**
     * Close appender
     */
    this.close = _.bind(stream.destroy, stream);

};

