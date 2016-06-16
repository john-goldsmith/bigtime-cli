let dotenv = require('dotenv');
dotenv.config();

let fs = require('fs-extra'),
    api = require('./api'),
    logger = require('./logger'),
    inquirer = require('inquirer'),
    prompts = require('./prompts'),
    moment = require('moment'),
    zeroPad = require('./util').zeroPad;

inquirer.prompt(prompts.config)
  .then(
    (answers) => {
      if (!answers.sessionToken || !answers.firmId || !answers.staffId) {
        logger.error('Missing session token, firm ID, or staff ID.');
        process.exit();
      }
      process.env.BIGTIME_SESSION_TOKEN = answers.sessionToken;
      process.env.BIGTIME_FIRM_ID = answers.firmId;
      process.env.BIGTIME_STAFF_ID = answers.staffId;
      return inquirer.prompt(prompts.sample.dateRange);
    }
  )
  .then(
    (answers) => {
      return api.sample.run(answers);
    }
  )
  .then(
    (response) => {
      if (!response) return;
      let now = moment(),
          month = zeroPad(now.month() + 1),
          day = zeroPad(now.date()),
          filename = `./results/${process.env.BIGTIME_STAFF_ID}/sample/${now.year()}-${month}-${day}-${now.valueOf()}.json`;
      fs.outputFile(filename, JSON.stringify(response), (err) => {
        if (err) throw err;
        logger.info(`Saved results to ${filename}`);
      });
    }
  );