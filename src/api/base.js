let fetch = require('isomorphic-fetch'),
    logger = require('../util').logger,
    /**
     * The following is available from the `isomorphic-fetch` package,
     * which is just a reference to the class exposed by the `node-fetch`
     * package.
     *
     * @see github.com/matthew-andrews/isomorphic-fetch/blob/master/fetch-npm-node.js
     */
    Request = global.Request;

/**
 * Base
 */
class Base {

  constructor() {
    this.baseUrl = 'https://iq.bigtime.net/BigtimeData/api/v2';
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Issue an HTTP GET request.
   *
   * @param  {String} url
   * @param  {Object} headers
   * @return {Promise}
   */
  get(url, headers = {}) {
    if (!url) throw new Error('Base#get: a URL is required.');
    return this.request(url, 'GET', null, headers);
  }

  /**
   * Issue an HTTP POST request.
   *
   * @param  {String} url
   * @param  {Null|Object} body
   * @param  {Object} headers
   * @return {Promise}
   */
  post(url, body = {}, headers = {}) {
    if (!url) throw new Error('Base#post: a URL is required.');
    return this.request(url, 'POST', body, headers);
  }

  /**
   * Issue an HTTP PUT request.
   *
   * @param  {String} url
   * @param  {Null|Object} body
   * @param  {Object} headers
   * @return {Promise}
   */
  put(url, body = {}, headers = {}) {
    if (!url) throw new Error('Base#put: a URL is required.');
    return this.request(url, 'PUT', body, headers);
  }

  /**
   * Issue an HTTP DELETE request.
   *
   * @param  {String} url
   * @param  {Null|Object} body
   * @param  {Object} headers
   * @return {Promise}
   */
  delete(url, body = {}, headers = {}) {
    if (!url) throw new Error('Base#delete: a URL is required.');
    return this.request(url, 'DELETE', body, headers);
  }

  /**
   * Issue an HTTP request.
   *
   * @param  {String} url
   * @param  {String} method
   * @param  {Null|Object} body
   * @param  {Object} headers
   * @return {Promise}
   */
  request(url, method, body, headers) {
    let request = new Request(`${this.baseUrl}/${url}`, {
      method,
      headers: Object.assign({}, headers, this.defaultHeaders),
      body: JSON.stringify(body)
    });
    logRequest(request);
    return fetch(request)
      .then(bodyAsJson)
      .then(logResponse)
      .then(checkResponseStatus);
  }

  /**
   * It's assumed this will only be called after a session has been
   * created.
   *
   * @static
   * @method authHeaders
   * @return {Object}
   */
  static authHeaders() {
    return {
      'X-Auth-Token': process.env.BIGTIME_SESSION_TOKEN,
      'X-Auth-Realm': process.env.BIGTIME_FIRM_ID
    };
  }

}

/**
 * Check if a response status code is in the 2xx or 3xx families.
 *
 * @private
 * @method checkResponseStatus
 * @param  {Response} response
 * @return {Promise}
 */
function checkResponseStatus(response) {
  return (response.status > 199 && response.status < 400) ? Promise.resolve(response) : Promise.reject(response);
}

/**
 * Converts the response body to JSON.
 *
 * @param  {Response} response
 * @return {Promise<Response>}
 */
function bodyAsJson(response) {
  return response.json()
    .then(
      (body) => {
        response.body = body; // TODO: Is this bad?
        return response;
      }
    );
}

/**
 * Log an HTTP request to STDOUT.
 *
 * @private
 * @method logResponse
 * @param  {Request} request
 * @return {Request}
 */
function logRequest(request) {
  logger.info(`[ REQ -> ] ${request.method} ${request.url}`);
  logger.info(`           ${JSON.stringify(request.headers._headers)}`);
  logger.info(`           ${request.body}`);
  logger.info(``);
  return request;
}

/**
 * Log an HTTP response to STDOUT.
 *
 * @private
 * @method logResponse
 * @param  {Response} response
 * @return {Response}
 */
function logResponse(response) {
  let level = (response.status > 199 && response.status < 400) ? 'info' : 'error';
  logger[level](`[ <- RES ] ${response.url} ${response.status} ${response.statusText} \n`);
  return response;
}

module.exports = Base;