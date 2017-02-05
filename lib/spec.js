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
    },
    test: {
        loggerLevel: 'info'
    },
    development: {
        loggerLevel: 'debug'
    }
}
