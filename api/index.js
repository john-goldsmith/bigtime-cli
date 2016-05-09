let Timesheet = require('./timesheet'),
    Session = require('./session'),
    Staff = require('./staff');

module.exports = {

  /**
   * An instance of Timesheet
   */
  timesheet: new Timesheet(),

  /**
   * An instance of Session
   */
  session: new Session(),

  /**
   * An instance of Staff
   */
  staff: new Staff()

};