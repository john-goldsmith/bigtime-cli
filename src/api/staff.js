let Base = require('./base');

class Staff extends Base {

  constructor() {
    super();
  }

  list(options = {}) {
    let url = `staff?ShowInactive=${options.showInactive || false}`;
    return this.get(url, Base.authHeaders);
  }

  detail(options = {}) {
    let url = `staff/detail/${options.staffId}?&View=Detailed`;
    return this.get(url, Base.authHeaders);
  }

}

module.exports = Staff;