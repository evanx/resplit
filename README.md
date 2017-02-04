
# text-lpush

<img src="https://raw.githubusercontent.com/evanx/text-lpush/master/docs/readme/.png"/>


## Use case

We want to import a text file.
```
```

## Config

See `lib/config.js` https://github.com/evanx/text-lpush/blob/master/lib/config.js

```javascript
```

## Implementation

See `lib/index.js` https://github.com/evanx/text-lpush/blob/master/lib/index.js

```javascript
```

## Docker

You can build as follows:
```
docker build -t text-lpush https://github.com/evanx/text-lpush.git
```

See `test/demo.sh` https://github.com/evanx/text-lpush/blob/master/test/demo.sh
- isolated network `test-evanx-network`
- isolated Redis instance named `test-evanx-redis`
- two `spiped` containers to test encrypt/decrypt tunnels
- the prebuilt image `evanxsummers/text-lpush`

### Thanks for reading

https://twitter.com/@evanxsummers
