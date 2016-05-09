module.exports = [
  {
    type: 'input',
    name: 'sessionToken',
    message: 'Session token:',
    default: process.env.BIGTIME_SESSION_TOKEN
  },
  {
    type: 'input',
    name: 'firmId',
    message: 'Firm ID:',
    default: process.env.BIGTIME_FIRM_ID
  },
  {
    type: 'input',
    name: 'staffId',
    message: 'Staff ID:',
    default: process.env.BIGTIME_STAFF_ID
  }
];