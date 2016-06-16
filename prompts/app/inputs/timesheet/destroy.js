module.exports = [
  {
    type: 'input',
    name: 'sid',
    message: 'Entry SID:'
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Are you sure you want to permanently delete this entry?',
    default: false
  }
];