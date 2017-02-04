
module.exports = async state => {
    const {config, logger} = state;
    logger.level = config.loggerLevel;
    logger.debug({config});
}
