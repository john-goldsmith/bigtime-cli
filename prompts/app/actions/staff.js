module.exports = [
  {
    type: 'list',
    name: 'actionSelection',
    message: 'Staff actions:',
    choices: [
      {
        name: 'List',
        value: 'list'
      },
      {
        name: 'Detail',
        value: 'detail'
      }
    ]
  }
];