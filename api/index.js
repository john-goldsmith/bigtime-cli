let endpoints = require('./endpoints'),
    Timesheet = require('./timesheet'),
    Session = require('./session'),
    Staff = require('./staff');
    Sample = require('./sample');

module.exports = {

  /**
   * A list of all endpoints
   */
  endpoints,

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
  staff: new Staff(),

  /**
   * An instance of Utils
   */
  sample: new Sample()

};