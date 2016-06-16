module.exports = [
  {
    type: 'list',
    name: 'actionSelection',
    message: 'Timesheet actions:',
    choices: [
      {
        name: 'Date range',
        value: 'dateRange'
      },
      {
        name: 'Date range summary',
        value: 'dateRangeSummary'
      },
      {
        name: 'Detail',
        value: 'detail'
      },
      {
        name: 'Create',
        value: 'create'
      },
      // {
      //   name: 'Update',
      //   value: 'update'
      // },
      {
        name: 'Destroy',
        value: 'destroy'
      }
    ]
  }
];