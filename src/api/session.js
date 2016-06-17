let Base = require('./base');

class Session extends Base {

  constructor() {
    super();
  }

  /**
   * Create a new session.
   *
   * @return {Promise<Response>}
   */
  create() {
    let url = 'session',
        body = {
          UserId: process.env.BIGTIME_USERNAME,
          Pwd: process.env.BIGTIME_PASSWORD
        };
    return this.post(url, body);
  }

}

module.exports = Session;