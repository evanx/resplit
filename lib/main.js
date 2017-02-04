
module.exports = async state => {
    const {config, logger} = state;
    logger.level = config.loggerLevel;
    logger.debug({config});
    return process.stdin.pipe(require('split')()).on('data', line => {
        const trimmed = line.trim();
        if (trimmed.length) {
            logger.debug({line});
        }
    });
}
