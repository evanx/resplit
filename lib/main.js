
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
