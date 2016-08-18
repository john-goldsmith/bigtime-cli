let dotenv = require('dotenv');
dotenv.config();

let api = require('./src/api'),
    logger = require('./src/util').logger,
    inquirer = require('inquirer');

if (!process.env.BIGTIME_USERNAME || !process.env.BIGTIME_PASSWORD) throw new Error('Missing BIGTIME_USERNAME or BIGTIME_PASSWORD environment variables.');

if (process.env.BIGTIME_SESSION_TOKEN) {
  inquirer.prompt(
    [
      {
        type: 'confirm',
        name: 'requestNewToken',
        message: 'A session token already exists. Are you sure you want to continue?',
        default: false
      }
    ]
  )
  .then(
    answers => answers.requestNewToken ? api.session.create() : Promise.reject()
  )
  .then(
    response => {
      logger.info(`Session token: ${response.body.token}`);
      logger.info(`Firm ID: ${response.body.firm}`);
      logger.info(`Staff ID: ${response.body.staffsid}`);
      logger.info('Store these in .env for future use, or enter them when running `npm run app` or `npm run sample`.');
    },
    response => response ? logger.error('Error creating a new session.', response.body) : logger.info('Aborted')
  );
  return;
}

api.session.create()
  .then(
    response => {
      logger.info(`API token: ${response.body.token}`);
      logger.info(`Firm ID: ${response.body.firm}`);
      logger.info(`Staff ID: ${response.body.staffsid}`);
    },
    response => {
      logger.error('Error creating a new session.', response.body);
    }
  );