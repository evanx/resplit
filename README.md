
# line-lpush

Containerizable utility to read lines of text from input and push into a Redis list.

<img src="https://raw.githubusercontent.com/evanx/line-lpush/master/docs/readme/main.png"/>


## Use case

We want to import a text file.

See `development/run.sh` https://github.com/evanx/line-lpush/blob/master/development/run.sh
```
redisKey='test:line-lpush'
redis-cli del $redisKey
(
echo 'line 1'
echo 'line 2'
echo 'line 3'
) | redisKey=$redisKey npm start
```
where we use the utility to `lpush` lines into the Redis key `test:line-lpush`

We inspect the list:
```
redis-cli lrange $redisKey 0 5
```
```
1) "line 3"
2) "line 2"
3) "line 1"
```
where the lines are in reverse order from the head.

We must use `RPOP` to pop lines from the tail:
```
$ redis-cli rpop $redisKey
"line 1"
```

## Config spec

See `lib/spec.js` https://github.com/evanx/line-lpush/blob/master/lib/spec.js
```javascript
module.exports = {
    description: 'Containerizable utility to read lines of text from input and push into a Redis list.',
    required: {
        redisHost: {
            description: 'the Redis host',
            default: 'localhost'
        },
        redisPort: {
            description: 'the Redis port',
            default: 6379
        },
        redisPassword: {
            description: 'the Redis password',
            required: false
        },
        redisKey: {
            description: 'the Redis list key'
        },
        loggerLevel: {
            description: 'the logging level',
            default: 'info',
            example: 'debug'
        }
    }
};
```
where `redisKey` is the list to which the utility will `lpush` the lines from standard input.

## Implementation

See https://github.com/evanx/line-lpush/blob/master/lib

Note `lib/index.js` uses the `redis-util-app-rpf` app archetype.
```
require('./redis-util-app-rpf')(require('./spec'), require('./main'));
```
where we extract the `config` from `process.env` according to the `spec` and invoke our `main` function.

See `lib/main.js` https://github.com/evanx/line-lpush/blob/master/lib/main.js
```javascript
const getStdin = require('get-stdin');

module.exports = async state => {
    const {config, logger, client} = state;
    logger.level = config.loggerLevel;
    logger.debug({config});
    const lines = await getStdin();
    await Promise.all(lines.trim().split('\n').map(
        line => client.lpushAsync(config.redisKey, line)
    ));
};
```

## Docker

You can build as follows:
```
docker build -t line-lpush https://github.com/evanx/line-lpush.git
```
from https://github.com/evanx/line-lpush/blob/master/Dockerfile

See `test/demo.sh` https://github.com/evanx/line-lpush/blob/master/test/demo.sh
- isolated network `test-evanx-network`
- isolated Redis instance named `test-evanx-redis`
- two `spiped` containers to test encrypt/decrypt tunnels
- the prebuilt image `evanxsummers/line-lpush`

### Thanks for reading

https://twitter.com/@evanxsummers
