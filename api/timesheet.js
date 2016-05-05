let Base = require('./base');

class Timesheet extends Base {

  constructor() {
    super();
    this.resourcePath = 'time';
  }

}

module.exports = new Timesheet();