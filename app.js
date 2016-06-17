let dotenv = require('dotenv');
dotenv.config();

let fs = require('fs-extra'),
    api = require('./src/api'),
    logger = require('./src/util').logger,
    inquirer = require('inquirer'),
    prompts = require('./src/prompts'),
    moment = require('moment'),
    zeroPad = require('./src/util').zeroPad,
    changeCase = require('change-case'),
    menuSelection = null,
    actionSelection = null,
    user = null;

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
      return api.staff.detail({staffId: process.env.BIGTIME_STAFF_ID});
    }
  )
  .then(
    (response) => {
      user = response.body;
      return inquirer.prompt(prompts.app.menu);
    },
    () => {
      //
    }
  )
  .then(
    (answers) => {
      menuSelection = answers.menuSelection;
      if (!api[menuSelection]) {
        logger.error(`Invalid API namespace (${menuSelection}).`);
        process.exit();
      }
      if (prompts.app.actions[menuSelection]) {
        return inquirer.prompt(prompts.app.actions[menuSelection]);
      }
      logger.error('Invalid menu selection.');
      process.exit();
    }
  )
  .then(
    (answers) => {
      actionSelection = answers.actionSelection;
      if (prompts.app.inputs[menuSelection][actionSelection]) {
        return inquirer.prompt(prompts.app.inputs[menuSelection][actionSelection]);
      }
    }
  )
  .then(
    (answers) => {
      let prototype = Object.getPrototypeOf(api[menuSelection]),
          properties = Object.getOwnPropertyNames(prototype);
      if (properties.includes(actionSelection)) {
        return api[menuSelection][actionSelection](answers);
      }
      logger.error(`Invalid API method (${actionSelection}).`);
      process.exit();
    }
  )
  .then(
    (response) => {
      let now = moment(),
          month = zeroPad(now.month() + 1),
          day = zeroPad(now.date()),
          filename = `./results/${changeCase.paramCase(user.FullName)}/${menuSelection}/${actionSelection}/${now.year()}-${month}-${day}-${now.valueOf()}.json`;
      fs.outputFile(filename, JSON.stringify(response.body), (err) => {
        if (err) throw err;
        let message = (Array.isArray(response.body)) ? `Saved ${response.body.length} results to ${filename}` : `Saved results to ${filename}`;
        logger.info(message);
      });
    }
  );