let Base = require('./base');

class Session extends Base {

  constructor() {
    super();
    this.resourcePath = 'session';
  }

  /**
   * [create description]
   * @return {[type]} [description]
   */
  create() {
    this.post(this.resourcePath, {UserId: process.env.BIGTIME_USERNAME, Pwd: process.env.BIGTIME_PASSWORD})
      .then(
        (response) => {
          console.log(response);
        }
      );
  }

}

module.exports = new Session();