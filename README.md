
# line-lpush

Containerizable utility to read lines of text from input and push into a Redis list.

<img src="https://raw.githubusercontent.com/evanx/line-lpush/master/docs/readme/main.png"/>


## Use case

We want to import a text file.
```
```

## Config

See `lib/config.js` https://github.com/evanx/line-lpush/blob/master/lib/config.js

```javascript
```

## Implementation

See `lib/index.js` https://github.com/evanx/line-lpush/blob/master/lib/index.js

```javascript
```

## Docker

You can build as follows:
```
docker build -t line-lpush https://github.com/evanx/line-lpush.git
```

See `test/demo.sh` https://github.com/evanx/line-lpush/blob/master/test/demo.sh
- isolated network `test-evanx-network`
- isolated Redis instance named `test-evanx-redis`
- two `spiped` containers to test encrypt/decrypt tunnels
- the prebuilt image `evanxsummers/line-lpush`

### Thanks for reading

https://twitter.com/@evanxsummers
