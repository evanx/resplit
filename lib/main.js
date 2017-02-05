
const split = require('split');
const through2 = require('through2');

module.exports = async ({config, logger, client}) => new Promise((resolve, reject) => {
    const inputStream = (config.highLength > 0 && config.delayMillis > 0)
    ? process.stdin.pipe(through2(function(buf, enc, next) {
        this.push(buf);
        client.llen(config.redisKey, (err, llen) => {
            if (err) {
                this.emit('error', err);
            } else if (llen > config.highLength) {
                logger.debug('sleep', llen);
                setTimeout(next, config.delayMillis);
            } else {
                next();
            }
        })
    }))
    : process.stdin;
    inputStream.pipe(split()).on('data', function(line) {
        client.lpush(config.redisKey, line, err => err? this.emit('error', err): undefined);
    }).on('end', () => {
        resolve();
    }).on('error', err => {
        reject(err);
    });
});
