
const assert = require('assert');
const lodash = require('lodash');
const redis = require('redis');
const bluebird = require('bluebird');
const clc = require('cli-color');
const multiExecAsync = require('multi-exec-async');
const redisLogger = require('redis-logger-rpf');
const appSpec = require('app-spec');
const Promise = bluebird;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

function DataError(message, data) {
    this.name = 'DataError';
    this.message = message;
    this.data = data;
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.captureStackTrace(this, this.constructor);
}

function asserta(actual, expected) {
    if (actual !== expected) {
        throw new DataError('Unexpected', {actual, expected});
    }
}

function asserto(object) {
    const key = Object.keys(object).find(key => !object[key]);
    if (key) {
        throw new DataError('Missing', {key});
    }
}

const debug = () => undefined;

module.exports = async spec => {
    debug(`redisApp '${spec.description}' {${Object.keys(spec.required).join(', ')}}`);
    try {
        const defaults = spec[process.env.NODE_ENV || 'production'];
        const config = appSpec(spec, process.env, {defaults});
        const client = redis.createClient({
            host: config.redisHost,
            port: config.redisPort,
            password: config.redisPassword
        });
        const ends = [async () => client.end()];
        const logger = redisLogger(config, redis);
        const end = async code => {
            await Promise.all(ends.map(end => end()));
            process.exit(code);
        };
        process.on('unhandledRejection', err => {
            //console.error(err.message);
            end(1);
        });
        return {
            ends, end,
            assert, clc, lodash, Promise,
            asserta, asserto, DataError,
            redis, client, logger, config,
            multiExecAsync
        };
    } catch (err) {
        console.error(['', clc.red.bold(err.message), ''].join('\n'));
        process.exit(1);
    }
};
