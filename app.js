let dotenv = require('dotenv');
dotenv.config();

let api = require('./api'),
    Staff = require('./api/staff'),
    logger = require('./logger'),
    inquirer = require('inquirer'),
    prompts = require('./prompts'),
    menuSelection = null,
    actionSelection = null;

inquirer.prompt(prompts.init)
  .then(
    (answers) => {
      if (!answers.sessionToken || !answers.firmId || !answers.staffId) {
        logger.error('Missing session token, firm ID, or staff ID.');
        process.exit();
      }
      process.env.BIGTIME_SESSION_TOKEN = answers.sessionToken;
      process.env.BIGTIME_FIRM_ID = answers.firmId;
      process.env.BIGTIME_STAFF_ID = answers.staffId;
      return inquirer.prompt(prompts.menu);
    }
  )
  .then(
    (answers) => {
      menuSelection = answers.menuSelection;
      if (prompts.actions[menuSelection]) {
        return inquirer.prompt(prompts.actions[menuSelection]);
      }
      logger.error('Invalid menu selection.');
      process.exit();
    }
  )
  .then(
    (answers) => {
      actionSelection = answers.actionSelection;
      if (prompts.inputs[menuSelection][actionSelection]) {
        return inquirer.prompt(prompts.inputs[menuSelection][actionSelection]);
      }
      return Promise.resolve();
      // if (!api[menuSelection]) logger.error(`Invalid API namespace (${menuSelection}).`);
    }
  )
  .then(
    (answers) => {
      console.log('answers', answers);
      let prototype = Object.getPrototypeOf(api[menuSelection]),
          properties = Object.getOwnPropertyNames(prototype);
      console.log(prototype, properties);
      if (properties.includes(actionSelection)) {
        return api[menuSelection][actionSelection](answers);
      }
      logger.error(`Invalid API method (${actionSelection}).`);
      process.exit();
    }
  )
  .then(
    (response) => {
      // response.body.forEach(staff => logger.info(`${staff.FullName} (Staff ID ${staff.StaffSID})`));
      logger.info('resolved', response.body);
    },
    (response) => {
      logger.error('rejected', response.body);
    }
  );