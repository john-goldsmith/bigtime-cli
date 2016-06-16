let Base = require('./base');

class Timesheet extends Base {

  constructor() {
    super();
  }

  /**
   * [dateRange description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  dateRange(options) {
    let url = `time/Sheet/${process.env.BIGTIME_STAFF_ID}?StartDt=${options.start}&EndDt=${options.end}&View=Detailed`;
    return this.get(url, Base.authHeaders());
  }

  /**
   * [dateRangeSummary description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  dateRangeSummary(options) {
    let url = `time/TotalByDay/${process.env.BIGTIME_STAFF_ID}?StartDt=${options.start}&EndDt=${options.end}`;
    return this.get(url, Base.authHeaders());
  }

  /**
   * [detail description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  detail(options) {
    let url = `time/${options.sid}`;
    return this.get(url, Base.authHeaders());
  }

  /**
   * [create description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  create(options) {
    console.log('Timesheet#create', options);
    let url = `time?MarkSubmitted=${options.markSubmitted || false}`,
        body = {
          Dt: options.date, // required
          ProjectSID: options.projectSid, // required
          // ProjectLinkValue: options.projectLinkValue, // required if projectSid is unknown
          // ProjectLinkType: options.projectLinkType, // required if projectSid is unknown
          StaffSID: options.staffSid || Number(process.env.BIGTIME_STAFF_ID), // required
          // StaffLinkValue: options.staffLinkValue, // required if staffSid is unknown
          // StaffLinkType: options.staffLinkType, // required if staffSid is unknown
          // BudgCatID: options.budgetCategoryId,
          BudgCatLinkValue: 'Development', // options.budgetCategoryLinkValue, // required if budgetCategoryId is unknown
          BudgCatLinkType: 1, // options.budgetCategoryLinkType, // required if budgetCategoryId is unknown
          // TaskSID: options.taskSid,
          // TaskNm: options.taskNumber,
          // QBClass: options.quickBooksClass,
          // PayrollItem: options.payrollItem,
          Hours_IN: options.hours, // required
          // Notes: options.notes,
          // AuditLogNote: options.auditLogNote,
          // NoCharge: options.noCharge,
          // HoursBillable: options.hoursBillable, // documentation claims this is required, but doesn't appear to be (or the API has a sensible default)
          // ChargeBillable: options.chargeBillable // documentation claims this is required, but doesn't appear to be (or the API has a sensible default)
        };
    return this.post(url, body, Base.authHeaders());
  }

  /**
   * [update description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  update(options) {
    let url = `time/${options.sid}?MarkSubmitted=${options.markSubmitted || false}`,
        body = {
          SID: options.sid, // required
          Dt: options.date, // required
          ProjectSID: options.projectSid, // required
          // ProjectLinkValue: options.projectLinkValue, // required if projectSid is unknown
          // ProjectLinkType: options.projectLinkType, // required if projectSid is unknown
          StaffSID: options.staffSid, // required
          // StaffLinkValue: options.staffLinkValue, // required if staffSid is unknown
          // StaffLinkType: options.staffLinkType, // required if staffSid is unknown
          // BudgCatID: options.budgetCategoryId,
          BudgCatLinkValue: options.budgetCategoryLinkValue, // required
          BudgCatLinkType: options.budgetCategoryLinkType, // required
          // TaskSID: options.taskSid,
          // TaskNm: options.taskNumber,
          // QBClass: options.quickBooksClass,
          // PayrollItem: options.payrollItem,
          Hours_IN: options.hours, // required
          // Notes: options.notes,
          // AuditLogNote: options.auditLogNote,
          // NoCharge: options.noCharge,
          HoursBillable: options.hoursBillable, // required
          ChargeBillable: options.chargeBillable // required
        };
    return this.post(url, body, Base.authHeaders());
  }

  /**
   * [destory description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  destroy(options) {
    if (!options.confirm) return;
    let url = `time/${options.sid}`,
        body = {};
    return this.delete(url, body, Base.authHeaders());
  }

}

module.exports = Timesheet;