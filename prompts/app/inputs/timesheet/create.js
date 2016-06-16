module.exports = [
  {
    type: 'confirm',
    name: 'markSubmitted',
    message: 'Mark submitted?',
    default: false
  },
  {
    type: 'input',
    name: 'date',
    message: 'Date:'
  },
  {
    type: 'input',
    name: 'projectSid',
    message: 'Project SID:'
  },
  // {
  //   type: 'input',
  //   name: 'projectLinkValue',
  //   message: 'Project Link Value:'
  // },
  // {
  //   type: 'input',
  //   name: 'projectLinkType',
  //   message: 'Project Link Type:'
  // },
  {
    type: 'input',
    name: 'staffSid',
    message: 'Staff SID:',
    default: process.env.BIGTIME_STAFF_ID
  },
  // {
  //   type: 'input',
  //   name: 'staffLinkValue',
  //   message: 'Staff Link Value:'
  // },
  // {
  //   type: 'input',
  //   name: 'staffLinkType',
  //   message: 'Staff Link Type:'
  // },
  /**
   * 129175: 'Consulting'
   * 129171: 'Development'
   */
  // {
  //   type: 'input',
  //   name: 'budgetCategoryId',
  //   message: 'Budget Category ID:',
  //   default: 129171
  // },
  // {
  //   type: 'input',
  //   name: 'budgetCategoryLinkValue',
  //   message: 'Budget Category Link Value:'
  // },
  // {
  //   type: 'input',
  //   name: 'budgetCategoryLinkType',
  //   message: 'Budget Category Link Type:'
  // },
  // {
  //   type: 'input',
  //   name: 'taskSid',
  //   message: 'Task SID:'
  // },
  // {
  //   type: 'input',
  //   name: 'taskNumber',
  //   message: 'Task Number:'
  // },
  // {
  //   type: 'input',
  //   name: 'quickBooksClass',
  //   message: 'QuickBooks Class:'
  // },
  // {
  //   type: 'input',
  //   name: 'payrollItem',
  //   message: 'Payroll Item:'
  // },
  {
    type: 'input',
    name: 'hours',
    message: 'Hours:'
  },
  // {
  //   type: 'input',
  //   name: 'notes',
  //   message: 'Notes:'
  // },
  // {
  //   type: 'input',
  //   name: 'auditLogNote',
  //   message: 'Audit Log Note:'
  // },
  // {
  //   type: 'input',
  //   name: 'noCharge',
  //   message: 'No Charge:'
  // },
  // {
  //   type: 'input',
  //   name: 'hoursBillable',
  //   message: 'Hours Billable:'
  // },
  // {
  //   type: 'input',
  //   name: 'chargeBillable',
  //   message: 'Charge Billable:'
  // }
];