let fetch = require('node-fetch');

class Base {

  constructor() {
    this.baseUrl = 'https://iq.bigtime.net/BigtimeData/api/v2/';
    this.headers = {
      'Content-Type': 'application/json'
    }
  }

  /**
   * [get description]
   * @param  {[type]} resourcePath [description]
   * @param  {[type]} headers      [description]
   * @return {[type]}              [description]
   */
  get(resourcePath, headers) {
    if (!resourcePath) throw new Error('Base#get: a resource path is required.');
    return this.request(resourcePath, 'GET', null, headers);
  }

  /**
   * [post description]
   * @param  {[type]} resourcePath [description]
   * @param  {[type]} body         [description]
   * @param  {[type]} headers      [description]
   * @return {[type]}              [description]
   */
  post(resourcePath, body = null, headers) {
    if (!resourcePath) throw new Error('Base#post: a resource path is required.');
    return this.request(resourcePath, 'POST', body, headers);
  }

  /**
   * [put description]
   * @param  {[type]} resourcePath [description]
   * @param  {[type]} body         [description]
   * @param  {[type]} headers      [description]
   * @return {[type]}              [description]
   */
  put(resourcePath, body = null, headers) {
    if (!resourcePath) throw new Error('Base#put: a resource path is required.');
    return this.request(resourcePath, 'PUT', body, headers);
  }

  /**
   * [delete description]
   * @param  {[type]} resourcePath [description]
   * @param  {[type]} body         [description]
   * @param  {[type]} headers      [description]
   * @return {[type]}              [description]
   */
  delete(resourcePath, body = null, headers) {
    if (!resourcePath) throw new Error('Base#delete: a resource path is required.');
    return this.request(resourcePath, 'DELETE', body, headers);
  }

  /**
   * [request description]
   * @param  {[type]} resourcePath [description]
   * @param  {String} method       [description]
   * @param  {[type]} body         [description]
   * @param  {Object} headers      [description]
   * @return {[type]}              [description]
   */
  request(resourcePath, method, body, headers) {
    headers = Object.assign(this.headers, headers);
    console.log('request:', resourcePath, method, body, headers);
    let url = `${this.baseUrl}${resourcePath}`;
    return fetch(url, {
      method,
      headers,
      body
    });
  }

}

module.exports = Base;