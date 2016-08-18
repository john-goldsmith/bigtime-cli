const pathToRegexp = require('path-to-regexp'),
      qs = require('qs'),
      apiBase = 'https://iq.bigtime.net/BigtimeData/api/v2';

function populateUrlParams (url = '', params = {}) {
  return pathToRegexp.compile(url)(params);
}

class Endpoints {

  static staffTimeSheet (staffId, queryParams = {}) {
    const url = '/time/Sheet/:staffId',
          defaultQueryParams = {View: 'Detailed'},
          urlParams = populateUrlParams(url, {staffId});
    queryParams = Object.assign({}, queryParams, defaultQueryParams);
    return `${apiBase}${urlParams}?${qs.stringify(queryParams)}`;
  }

  static session (queryParams = {}) {
    const url = '/session';
    return `${apiBase}${url}?${qs.stringify(queryParams)}`;
  }

  static staff (queryParams = {}) {
    // const url =
  }

}

module.exports = Endpoints;
  // timeSheet: 'time/Sheet/:staffId?StartDt=${this.answers.dataStart}&EndDt=${this.answers.dataEnd}&View=Detailed',
  // session: 'session',
  // staff: 'staff?ShowInactive=${options.showInactive || false}',
  // staffDetail: 'staff/detail/:staffId?&View=Detailed',
  // timeSheet2: 'time/Sheet/:staffId?StartDt=${options.start}&EndDt=${options.end}&View=Detailed',
  // totalByDay: 'time/TotalByDay/:staffId?StartDt=${options.start}&EndDt=${options.end}',
  // time: 'time/:sid',
  // time2: 'time?MarkSubmitted=${options.markSubmitted || false}',
  // time3: 'time/:sid?MarkSubmitted=${options.markSubmitted || false}',
  // get: {
  //   timeSheet: {
  //     base: 'time/Sheet/:staffId',
  //     params: {
  //       StartDt: {
  //         default: null
  //       },
  //       EndDt: {
  //         default: null
  //       },
  //       View: {
  //         default: 'Detailed'
  //       }
  //     }
  //   }
  // },
  // post: {},
  // put: {},
  // delete: {}
// };