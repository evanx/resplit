
const split = require('split');
const through2 = require('through2');

const promiseDelay = delay => new Promise(resolve => setTimeout(() => resolve(), delay));

module.exports = async ({config, logger, client}) => new Promise((resolve, reject) => {
    const inputStreamDelayer = function(buf, enc, next) {
        this.push(buf);
        client.llenAsync(config.redisKey).then(llen => {
            if (llen > config.highLength) {
                const delay = Math.floor(config.delayMillis*llen/config.highLength);
                logger.warn({llen, delay});
                promiseDelay(delay).then(next);
            } else {
                next();
            }
        }).catch(err => this.emit('error', err));
    };
    const inputStream = (config.highLength > 0 && config.delayMillis > 0)
    ? process.stdin.pipe(through2(inputStreamDelayer))
    : process.stdin;
    inputStream.pipe(split()).on('data', function(line) {
        client.lpush(config.redisKey, line, err => err? this.emit('error', err): undefined);
    }).on('end', () => {
        resolve();
    }).on('error', err => {
        reject(err);
    });
});
