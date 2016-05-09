let Base = require('./base');

class Timesheet extends Base {

  constructor() {
    super();
  }

  dateRange(options) {
    console.log('options', options);
    let url = `time/Sheet/${process.env.BIGTIME_STAFF_ID}?StartDt=${options.start}&EndDt=${options.end}&View=Detailed`;
    return this.get(url, Base.authHeaders());
  }

  dateRangeSummary(options) {
    let url = `time/TotalByDay/${process.env.BIGTIME_STAFF_ID}?StartDt=${options.start}&EndDt=${options.end}`;
    return this.get(url, Base.authHeaders());
  }

}

module.exports = Timesheet;