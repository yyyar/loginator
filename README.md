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
var log = loginator.createLogger( /* {optional configuration} */ );

// or get logger, and cache it for future calls
// var log = loginator.getLogger('mylogger' /* , {optional configuration } */);

/* Logging levels example */

log.debug('Hello world!');
// -> 2015-03-28 11:54:31 [DEBUG] [node] (default) : Hello world!

log.info('Hello world!');
// -> 2015-03-28 11:54:31 [INFO ] [node] (default) : Hello world!

log.warn('Hello world!');
// -> 2015-03-28 11:54:31 [WARN ] [node] (default) : Hello world!

log.error('Hello world!');
// -> 2015-03-28 11:54:31 [ERROR] [node] (default) : Hello world!

log.fatal('Hello world!');
// -> 2015-03-28 11:54:31 [FATAL] [node] (default) : Hello world!


/* Logging objects */

log.info('Hello world!', {'some': 'object'}, new Date(), new Error('Error!!!'));
// -> 2015-03-28 11:54:31 [INFO ] [node] (default) : Hello world! {"some":"object"} "2015-03-28T09:54:31.096Z" Error: Error!!!
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
            pattern: '[%level] %dtime (%name) (%location) ~ %message'
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
    ]
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
name          -  logger name
location      -  location (filename:line) of log call
longlocation  -  long location (/full/path/to/filename:line) of log call
```

##### Text Formatter
```javascript
{
    type: 'text',
    options: {
        pattern: '[%dtime] [%level] - %message'
    }
}
```

Where `pattern` may be any mix of variables prefixed by `%`.

##### JSON Formatter
```javascript
{
    type: 'json',
    options: {
        fields: ['dtime', 'message', 'level', 'process'],
        pretty: true | false
    }
}
```

Where `fields` is an array of variables to include to resulting json.
And `pretty` is indicator that you want pretty-printed multi-line json


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
        shareStream: true, // optional
        formatter: { /* ... */ } // optional
    }
}
```
Where `path (string)` is path to log output file,
and `shareStream (bool)` indicates that appenders should reuse the same stream to file if exists
instead of opening file.

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
        formatter: { /* ... */ } // optional
    }
}
```
Where `host`, `port` and `options` are redis configuration params.


##### Custom Appenders
You can register you custom appender and then use it in configuration in the 
same way as build-in appenders.

To do so you need to inherit you custom appender from `appenders/_base.js` first
overriding `performWrite` and optionally `close` functions.

Checkout `tests/custom/customAppender.js` for custom appender example and
`tests/registerAppender.js` file for it's usage.


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
            pattern: '%dtime (%myVar): %message'
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

