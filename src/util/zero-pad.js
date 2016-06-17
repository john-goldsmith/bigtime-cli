/**
 * [zeroPad description]
 *
 * @param  {Mixed} input
 * @return {String}
 */
module.exports = function (input) {
  return `0${input}`.slice(-2);
};