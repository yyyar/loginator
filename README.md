## loginator

[![Build Status](https://travis-ci.org/yyyar/loginator.svg?branch=master)](https://travis-ci.org/yyyar/loginator) [![NPM version](https://badge.fury.io/js/loginator.svg)](http://badge.fury.io/js/loginator)

Loginator is simple and configurable logger for Node.js.

* **Configurable**: Logging format, level, multiple appenders, formatters and overrides
* **Formatters**: Configurable Text and JSON formatters
* **Appenders**: Configurable Stdout, File & Redis appenders
* **Custom Vars**: Inherit bound loggers overriding custom variables

### Installation
```bash
$ npm install loginator
```

### Usage

#### Simple example

```javascript
var loginator = require('loginator');

// create new logger
var log = loginator.createLogger({
  // Example with date format options
  formatter: {
    type: 'text',
    options: {
      pattern: '[%dtime] [%level] - %message',
      dateFormat: 'yyyy-mm-dd',
      timeFormat: 'HH:MM:ss',
      dtimeFormat: 'yyyy-mm-dd HH:MM:ss'
    }
  }
});

// or get logger, and cache it for future calls
// var log = loginator.getLogger('mylogger' /* , {optional configuration } */);

/* Logging levels example */

log.debug('Hello world!');
// -> [2015-03-28 11:54:31] [DEBUG] - Hello world!

log.info('Hello world!');
// -> [2015-03-28 11:54:31] [INFO] - Hello world!

log.warn('Hello world!');
// -> [2015-03-28 11:54:31] [WARN] - Hello world!

log.error('Hello world!');
// -> [2015-03-28 11:54:31] [ERROR] - Hello world!

log.fatal('Hello world!');
// -> [2015-03-28 11:54:31] [FATAL] - Hello world!


/* Logging objects */

log.info('Hello world!', {'some': 'object'}, new Date(), new Error('Error!!!'));
// -> [2015-03-28 11:54:31] [INFO] - Hello world! {"some":"object"} "2015-03-28T09:54:31.096Z" Error: Error!!!
```

#### Configuration
`loginator.createLogger()` accepts one optional configuration object.
*Note*. Loginator configuration object may be a simple JSON so you can easily store logger configuration in external JSON file.

```javascript
var log = loginator.createLogger({

    // Logger name
    name: 'mylogger',

    // logging level. Logs with less logging level will be omitted.
    // Supported values are: 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR' and 'FATAL':
    level: 'DEBUG',

    // truncate 'message' to limitMessageLength chars.
    // 0, if leave message as it is without truncation
    limitMessageLength: 0,

    // formatter defines how to format log output.
    // this is a default formatter that will apply to all appenders by default,
    // and it can be overwritten in any concrete appender configuration
    // (see following paragraphs for more examples)
    formatter: {
        type: 'text',
        options: {
            pattern: '[%level] %dtime (%name) (%location) ~ %message',
            dateFormat: 'yyyy-mm-dd',       // optional, format for %date
            timeFormat: 'HH:MM:ss',         // optional, format for %time
            dtimeFormat: 'yyyy-mm-dd HH:MM:ss' // optional, format for %dtime
        }
    },

    // appenders defines a list of destinations
    // where log messages will go
    // (see following paragraphs for more examples)
    appenders: [
        {
            type: 'stdout',
            level: 'INFO', // optional level override
            options: {
                formatter: { /* ... */ } // optional formatter override
            }
        }
    ],

    // (optional) loglog - function that is called by loginator to log its own messages
    // it may happen in case of some problem in appender and we have no other way to log it.
    loglog: console.error
});
```

#### Default configuration
You can set default configuration:

```javascript
loginator.configure({
    // configuration
});
```
In this case configuration fields passed to `loginator.createLogger` will override default ones.


#### Formatters
Formatter defines how log output will be formated. Formatter can be configured:
- Globally for logger. It's configuration should be passed into logger config.
- Per appender. By defaults all appenders inherit logger's formatter, but you can
overwrite formatter for concrete appender (see Appenders section for more details).

There are several predefined variables that can be used in formatters config:
```
message       -  logging message (joined arguments)
date          -  date only
dtime         -  date with time
time          -  time only
level         -  logging level
process       -  process name
hostname      -  host name (from `os.hostname()`)
name          -  logger name
location      -  location (filename:line) of log call
longlocation  -  long location (/full/path/to/filename:line) of log call
```

##### Text Formatter
```javascript
{
    type: 'text',
    options: {
        pattern: '[%dtime] [%level] - %message',
        dateFormat: 'yyyy-mm-dd',       // optional, format for %date
        timeFormat: 'HH:MM:ss',         // optional, format for %time
        dtimeFormat: 'yyyy-mm-dd HH:MM:ss', // optional, format for %dtime
    }
}
```

Where `pattern` may be any mix of variables prefixed by `%`. You can customize date and time formats using `dateFormat`, `timeFormat`, and `dtimeFormat` options. These formats use the [dateformat](https://www.npmjs.com/package/dateformat) library's formatting tokens.

###### Using 12-hour Time Format

For 12-hour time format with AM/PM indicator, use:

```javascript
{
    type: 'text',
    options: {
        pattern: '[%dtime] [%level] - %message',
        timeFormat: 'h:MM:ss TT',        // 12-hour format with seconds and AM/PM
        dtimeFormat: 'yyyy-mm-dd h:MM TT' // date with 12-hour time
    }
}
```

##### JSON Formatter
```javascript
{
    type: 'json',
    options: {
        fields: ['dtime', 'message', 'level', 'process'],
        pretty: true | false,  // default: false
        stringifyMessage: true | false,   // default: false
        dateFormat: 'yyyy-mm-dd',       // optional, format for %date
        timeFormat: 'HH:MM:ss',         // optional, format for %time
        dtimeFormat: 'yyyy-mm-dd HH:MM:ss' // optional, format for %dtime
    }
}
```

Where `fields` is an array of variables to include to resulting json.
`pretty` is indicator that you want pretty-printed multi-line json.
`stringifyMessage` means that we want stringify message array instead
of pushing it as JSON subtree.
Additionally, you can customize date and time formats using `dateFormat`, `timeFormat`, and `dtimeFormat` options.


##### Custom Formatters
Feature will be added soon.


#### Appenders
Appender is a destination of where log output will go.

##### Appender Overrides
You can override logging level and formatter of any appender options:
```javascript
{
    type: '<type>',
    level: 'INFO', // optional, will override default logger level
    options: {
        formatter: { /* ... */ } // optional
    }
}
```

##### Stdout Appender
```javascript
{
    type: 'stdout',
    options: {
        formatter: { /* ... */ } // optional
    }
}
```

##### File Appender
```javascript
{
    type: 'file',
    options: {
        path: '/tmp/out.log',
        rollingSize: '100kb', // max size of file before rolling
        formatter: { /* ... */ } // optional
    }
}
```
Where `path (string)` is path to log output file,
and `rollingSize (string)` is a maximum output file size before it will be rolled. Unlimited by default.
Possible units are: b, kb, mb, gb.

##### Redis Appender
When using Redis Appenders messages would be PUBLISHed to `loginator:<namespace>` channel.

```javascript
{
    type: 'redis',
    options: {

        // redis client configuration
        host: 'localhost',
        port: 6379,
        options: {},

        // other
        namespace: 'default',
        formatter: { /* ... */ }, // optional
        shareConnection: false    // optional Share redis connection between namespaces (since 0.0.26)
    }
}
```
Where `host`, `port` and `options` are redis configuration params.
`shareConnection` option enables internal cache of redis clients, so that multiple instances of
the redis appender with the same `host` and `port` will use one redis client.

##### Web Appender
When using Web appender, messages would be sent over http/https as request body to the specified URL.
For an example, see `tests/web.js`.

```javascript
{
    type: 'web',
    options: {

        // request configuration
        url: 'http://some.url.com/log',
        method: 'POST', // optional, default GET
        headers: {},    // optional

        // other
        formatter: { /* ... */ } // optional
    }
}
```

##### Custom Appenders
You can register you custom appender and then use it in configuration in the
same way as build-in appenders.

To do so you need to inherit you custom appender from `loginator.BaseAppender` first
overriding `performWrite` and (optionally) `close` functions.

Checkout `tests/custom/customAppender.js` for custom appender example and
`tests/registerAppender.js` file for it's usage.

##### Custom Formatters
Will come soon...

#### Custom Variables & Bound Loggers
Bound logger is logger that inherits all base logger instence properties and
overrides custom variables.

```javascript
var log = loginator.createLogger({
    customVars: {
        'myVar': 'nothing'
    },
    formatter: {
        type: 'text',
        options: {
            pattern: '%dtime (%myVar): %message',
            dateFormat: 'yyyy-mm-dd',
            timeFormat: 'HH:MM:ss',
            dtimeFormat: 'yyyy-mm-dd HH:MM:ss'
        }
    }
});

var boundLog = log.bind({
    'myVar': 'MY1'
});

var boundLog2 = log.bind({
    'myVar': 'MY2'
});

log.info('Not bound');
// -> 2015-03-29 05:41:50 (nothing): Not bound

boundLog.info('Bound 1');
// -> 2015-03-29 05:41:50 (MY1): Bound 1

boundLog2.info('Bound 2');
// -> 2015-03-29 05:41:50 (MY2): Bound 2

```

#### Reusing Appenders
For example, you want to create several logs sharing the same appender (this is common in case
of file), not forcing to open stream (for file appenders) or connection (for redis appenders) several times.
In this can you can create appender and then reuse it in several loggers. In this case you'll pass
appender instance insteof of configuration object to `logger.appenders` array.

```javascript
var loginator = require('loginator');

var stdoutAppender = loginator.createAppender({
    type: 'stdout'
});

var log = loginator.createLogger({
    name: 'log',
    appenders: [
        stdoutAppender
    ]
});

var log2 = loginator.createLogger({
    name: 'log2',
    appenders: [
        stdoutAppender
    ]
});

log.debug('Hello world!');
// -> 2015-03-30 03:48:49 [DEBUG] [node] (log) : Hello world!

log2.debug('Bye world!');
// -> 2015-03-30 03:48:49 [DEBUG] [node] (log2) : Bye world!
```

#### Examples
See `tests` directory for examples.

#### Tests
```bash
$ sudo npm install nodeunit -g
$ npm test
```

#### Author
* [Yaroslav Pogrebnyak](https://github.com/yyyar/)

#### License
MIT

