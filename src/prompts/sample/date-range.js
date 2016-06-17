let moment = require('moment'),
    zeroPad = require('../../util').zeroPad,
    now = moment(),
    year = now.year(),
    month = zeroPad(now.month() + 1),
    date = zeroPad(now.date()),
    dataStart = '2016-01-01', // TODO: Fix this
    dataEnd = `${year}-${month}-${date}`,
    // submitStartMoment = now.subtract(process.env.BIGTIME_SAMPLE_NUM_ENTRIES, 'days'),
    // submitStartYear = submitStartMoment.year(),
    // submitStartMonth = zeroPad(submitStartMoment.month() + 1),
    // submitStartDate = zeroPad(submitStartMoment.date()),
    // submitStart = `${submitStartYear}-${submitStartMonth}-${submitStartDate}`,
    submitEnd = `${year}-${month}-${date}`;

module.exports = [
  {
    type: 'input',
    name: 'dataStart',
    message: 'Data start date (YYYY-MM-DD):',
    default: dataStart
  },
  {
    type: 'input',
    name: 'dataEnd',
    message: 'Data end date (YYYY-MM-DD):',
    default: dataEnd
  },
  // {
  //   type: 'input',
  //   name: 'submitStart',
  //   message: 'Submit start date (YYYY-MM-DD):',
  //   default: submitStart
  // },
  {
    type: 'input',
    name: 'submitEnd',
    message: 'Submit end date (YYYY-MM-DD):',
    default: submitEnd
  },
  {
    type: 'input',
    name: 'numEntries',
    message: 'Number of days to generate data for:',
    default: process.env.BIGTIME_SAMPLE_NUM_ENTRIES
  }
];