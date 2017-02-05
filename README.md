
# line-lpush

Containerizable utility to read lines of text from input and push into a Redis list.

<img src="https://raw.githubusercontent.com/evanx/line-lpush/master/docs/readme/main2.png"/>

## Use case

Say we need to import a text file, or lines of output from some process, for further processing.

If we wish to write simple Redis-driven microservices, then the first step is to stream those lines of text into Redis.

This utility can perform that first step. It can be built and run as a Docker container for convenience.

## Test run

See `development/run.sh` https://github.com/evanx/line-lpush/blob/master/development/run.sh

We will use the utility to `lpush` lines into the Redis key `test:line-lpush`
```
redisKey='test:line-lpush'
```
Let's delete the key for starters.
```
redis-cli del $redisKey
```
Now we `npm start` our test run:
```
(
echo 'line 1'
echo 'line 2'
echo 'line 3'
) | redisKey=$redisKey npm start
```
We inspect the list:
```
$ redis-cli lrange $redisKey 0 5
1) "line 3"
2) "line 2"
3) "line 1"
```
where we notice that the lines are in reverse order. This is because the utility performs an `lpush` (left push) operation, and so the last line is at the head (left side) of the list.

See https://redis.io/commands/lpush

Therefore for further processing of the imported lines in order, we would use `RPOP` to pop lines from right side (tail) of the list:
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
        highLength: {
            description: 'the length of the list for back-pressure',
            default: 500
        },
        delayMillis: {
            description: 'the delay duration in milliseconds when back-pressure',
            unit: 'ms',
            default: 5000
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

See `lib/main.js` https://github.com/evanx/line-lpush/blob/master/lib/main.js
```javascript
    inputStream.pipe(split()).on('data', function(line) {
        client.lpush(config.redisKey, line, err => err? this.emit('error', err): undefined);
    }).on('end', () => {
        resolve();
    }).on('error', err => {
        reject(err);
    });
```

Incidently we delay the input stream using the length of the Redis list for such back-pressure:
```javascript
const inputStreamTransform = function(buf, enc, next) {
    this.push(buf);
    client.llen(config.redisKey, (err, llen) => {
        if (err) {
            this.emit('error', err);
        } else if (llen > config.highLength) {
            const delay = Math.floor(config.delayMillis*llen/config.highLength);
            logger.warn({llen, delay});
            setTimeout(next, delay);
        } else {
            next();
        }
    })
};
```

Incidently `lib/index.js` uses the `redis-util-app-rpf` application archetype.
```
require('./redis-util-app-rpf')(require('./spec'), require('./main'));
```
where we extract the `config` from `process.env` according to the `spec` and invoke our `main` function.

That archetype is embedded in the project, as it is still evolving. Also, you can find it at https://github.com/evanx/redis-util-app-rpf.


## Docker

You can build as follows:
```
docker build -t line-lpush https://github.com/evanx/line-lpush.git
```
from https://github.com/evanx/line-lpush/blob/master/Dockerfile

See `test/demo.sh` https://github.com/evanx/line-lpush/blob/master/test/demo.sh
```
cat test/lines.txt |
  docker run \
  --network=test-evanx-network \
  --name test-evanx-app \
  -e NODE_ENV=production \
  -e redisHost=$encipherHost \
  -e redisPort=$encipherPort \
  -e redisPassword=$redisPassword \
  -e redisKey=$redisKey \
  -d -i evanxsummers/line-lpush
redis-cli -a $redisPassword -h $encipherHost -p $encipherPort lrange $redisKey 0 5
docker rm -f test-evanx-redis test-evanx-app test-evanx-decipher test-evanx-encipher
docker network rm test-evanx-network
```
having:
- isolated network `test-evanx-network`
- isolated Redis instance named `test-evanx-redis`
- two `spiped` containers to test encrypt/decrypt tunnels
- the prebuilt image `evanxsummers/line-lpush`

### Thanks for reading

https://twitter.com/@evanxsummers
