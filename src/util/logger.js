let winston = require('winston'),
    logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          colorize: 'all',
          showLevel: false
        })
      ]
    });

module.exports = logger;