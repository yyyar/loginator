## loginator

[![Build Status](https://travis-ci.org/yyyar/loginator.svg?branch=master)](https://travis-ci.org/yyyar/loginator) [![NPM version](https://badge.fury.io/js/loginator.svg)](http://badge.fury.io/js/loginator)

loginator is very simple and configurable ready logger for Node.js.

* **Simple**: Start using in seconds
* **Configurable**: Configure logging format, level, etc
* **Formatters**: Build-in configurable text and json formatters
* **Appenders**: Built-in stdout, file & redis appenders

### Installation
```bash
$ npm install loginator
```

### Usage

#### Simple example

```javascript
var loginator = require('loginator');

var log = loginator.createLogger( /* {configuration} */ );

// Logging levels
log.debug('Hello world!');
log.info('Hello world!');
log.warn('Hello world!');
log.error('Hello world!');
log.fatal('Hello world!');

// Logging objects
log.info('Hello world!', {'some': 'object'}, new Date(), new Error('Error!!!'));

```

#### Configuration
loginator.createLogger accepts optional configuration object.
Note. Loginator configuration object may be a simple JSON so you can easily
store logger configuration in external JSON file.
Here listed all possible configuration values:

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
            pattern: '[%level] %dtime ~ %message'
        }
    },

    // appenders defines a list of destinations
    // where log messages will go
    // (see following paragraphs for more examples)
    appenders: [
        {
            type: 'stdout',
            options: {
                formatter: { /* ... */ }
            }
        }
    ]
});
```

#### Formatters
Formatter defines how log output will be formated. Formatter can be configured:
- Globally for logger. It's configuration should be passed into logger config.
- Per appender. By defaults all appenders inherit logger's formatter, but you can
overwrite formatter for concrete appender (see Appenders section for more details).

There are several predefined variables that can be used in formatters config:
```message, date, dtime, time, level, process, name```

##### Text Formatter
```javascript
{
    type: 'text',
    options: {
        pattern: '[%dtime] [%level] - %message'
    }
}
```

Where 'pattern' may be any mix of variables prefixed by '%'.

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
And 'pretty' is indicator that you want pretty-printed multi-line json


##### Custom Formatters
Feature will be added soon.


#### Appenders
Appender is a destination of where log output will go.

##### Appender Formatter Override
You can pass formatter to any appender options to override logger-level formatter:
```javascript
{
    type: '<type>',
    options: {
        formatter: { /* ... */ }
    }
}
```

##### Stdout Appender
```javascript
{
    type: 'stdout',
    options: {}
}
```

##### File Appender
```javascript
{
    type: 'file',
    options: {
        path: '/tmp/out.log'
    }
}
```
Where `path` is path log output file.

##### Redis Appender
```javascript
{
    type: 'redis',
    options: {
        host: 'localhost',
        port: 6379,
        options: {}
    }
}
```
Where `host`, `port` and `options` are redis configuration params.


##### Custom Appenders
Feature will be added soon.


#### Tests
```bash
$ sudo npm install nodeunit -g
$ npm test
```

#### Author
* [Yaroslav Pogrebnyak](https://github.com/yyyar/)

#### License
MIT

