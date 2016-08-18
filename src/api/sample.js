let Base = require('./base'),
    inquirer = require('inquirer'),
    prompts = require('../prompts'),
    zeroPad = require('../util').zeroPad,
    moment = require('moment'),
    logger = require('../util').logger,
    timesheet = new (require('./timesheet')),
    config = require('../config'),
    queue = require('async/queue'),
    createTimeEntryQueue = queue(createTimeEntryWorker);

function createTimeEntryWorker (entry, callback) {
  timesheet.create(entry);
  setTimeout(() => {
    callback();
  }, 2000); // Respect the API limt of 1 request every 2 seconds
}

class Sample extends Base {

  constructor() {
    super();
    this.answers = {};
    this.rawResponseBody = null;
    this.transformedData = {
      data: {
        byProject: {},
        byDate: {}
      },
      meta: {
        averageDailyHours: 0,
        projectCount: 0,
        entryCount: 0,
        dateCount: 0,
        totalHours: 0,
        projects: []
      }
    };
    this.sampleData = [];
    this.weightedProjectData = [];
    this.randomEntry = null;
    this.randomTime = null;
  }

  /**
   * [run description]
   *
   * @param  {Object} answers
   * @return {Promise}
   */
  run (answers) {
    this.answers = answers;
    process.env.BIGTIME_SAMPLE_NUM_ENTRIES = answers.numEntries;
    return this._getData()
      .then(
        response => {
          this.rawResponseBody = response.body;
          this._transform();
          this._appendMetaData();
          this._weightProjectData();
          this._setupSampleData();
          return this._getPreexistingData();
        },
        () => {
          // TODO
        }
      )
      .then(
        () => {
          this._populateSampleData();
          this._displaySampleData();
          return this._prompt();
        }
      )
      .then(
        answers => {
          if (!answers.confirmSubmit) return null;
          this._queue();
          return this.sampleData;
        },
        () => {
          // TODO
        }
      );
  }

  /**
   * [_getData description]
   *
   * @private
   * @return {Promise<Response>}
   */
  _getData() {
    let url = `time/Sheet/${process.env.BIGTIME_STAFF_ID}?StartDt=${this.answers.dataStart}&EndDt=${this.answers.dataEnd}&View=Detailed`;
    return this.get(url, Base.authHeaders);
    // const url = endpoints.staffTimeSheet(process.env.BIGTIME_STAFF_ID, {
    //   StartDt: this.answers.dataStart,
    //   EndDt: this.answers.dataEnd
    // });
    // return this.get(url, Base.authHeaders);
  }

  /**
   * [_getSubmittalData description]
   * @return {Promise}
   */
  _getPreexistingData() {
    let submitStartMoment = moment(this.answers.submitEnd).subtract(this.sampleData.length - 1, 'days'),
        submitStartYear = submitStartMoment.year(),
        submitStartMonth = zeroPad(submitStartMoment.month() + 1),
        submitStartDate = zeroPad(submitStartMoment.date()),
        start = `${submitStartYear}-${submitStartMonth}-${submitStartDate}`,
        end = this.answers.submitEnd;
    return timesheet.dateRange({start, end})
      .then(
        response => {
          this.preexistingData = response.body;
        },
        error => {
          // TODO
        }
      );
  }

  /**
   * [_transform description]
   *
   * @private
   * @return {undefined}
   */
  _transform() {
    this.rawResponseBody.forEach(entry => {
      let reducedEntry = reduceEntry(entry);
      if (!this.transformedData.data.byProject[entry.ProjectSID]) this.transformedData.data.byProject[entry.ProjectSID] = [];
      this.transformedData.data.byProject[entry.ProjectSID].push(reducedEntry);

      if (!this.transformedData.data.byDate[entry.Dt]) this.transformedData.data.byDate[entry.Dt] = [];
      this.transformedData.data.byDate[entry.Dt].push(reducedEntry);
    });
  }

  /**
   * [_appendMetaData description]
   *
   * @return {undefined}
   */
  _appendMetaData() {
    let projectKeys = Object.keys(this.transformedData.data.byProject),
        dateKeys = Object.keys(this.transformedData.data.byDate);

    this.transformedData.meta.entryCount = this.rawResponseBody.length;
    this.transformedData.meta.projectCount = projectKeys.length;
    this.transformedData.meta.dateCount = dateKeys.length;
    dateKeys.forEach(dateKey => {
      this.transformedData.data.byDate[dateKey].forEach((entry) => {
        this.transformedData.meta.totalHours += entry.Hours_IN;
      });
    });
    projectKeys.forEach(projectKey => {
      let project = this.transformedData.data.byProject[projectKey],
          totalEntries = project.length,
          totalHours = null,
          projectName = null,
          projectSid = null,
          clientName = null,
          clientId = null;
      project.forEach((entry) => {
        totalHours += entry.Hours_IN;
        projectName = entry.ProjectNm;
        clientName = entry.ClientNm;
        projectSid = entry.ProjectSID;
        clientId = entry.ClientID;
      });
      this.transformedData.meta.projects.push({
        projectName,
        projectSid,
        clientName,
        clientId,
        totalHours,
        totalEntries,
        averageEntryHours: totalHours / totalEntries
      });
    });
    this.transformedData.meta.averageDailyHours = this.transformedData.meta.totalHours / dateKeys.length;
  }

  /**
   * [_sample description]
   *
   * @private
   * @return {undefined}
   */
  _weightProjectData() {
    this.transformedData.meta.projects.forEach(project => {
      for (let i = 0; i < project.totalEntries; i++) {
        if (!config.blackListedProjectNames.includes(project.projectName)) this.weightedProjectData.push(project);
      }
    });
  }

  /**
   * [_setupSampleData description]
   *
   * @return {undefined}
   */
  _setupSampleData() {
    for (let j = 0; j < Number.parseInt(process.env.BIGTIME_SAMPLE_NUM_ENTRIES); j++) {
      this.sampleData.push([]);
    }
  }

  /**
   * [_populateSampleData description]
   *
   * @return {undefined}
   */
  _populateSampleData() {
    this.sampleData.forEach((day, i) => {
      console.log('day', i);
      let entrySubmit = moment(this.answers.submitEnd).subtract(i, 'days'),
          entrySubmitYear = entrySubmit.year(),
          entrySubmitMonth = zeroPad(entrySubmit.month() + 1),
          entrySubmitDate = zeroPad(entrySubmit.date()),
          date = `${entrySubmitYear}-${entrySubmitMonth}-${entrySubmitDate}`;
      while (this._getTotalLoggedTimeForDay(day, date) < Number(process.env.BIGTIME_SAMPLE_MIN_DAILY_HOURS)) {
        this._setRandomEntry();
        this._setRandomTime();
        let newTotal = Number(this._getTotalLoggedTimeForDay(day) + this.randomTime);
        if (newTotal < Number(process.env.BIGTIME_SAMPLE_MAX_DAILY_HOURS)) {
          this.randomEntry.hours = this.randomTime;
          this.randomEntry.date = date;
          this.sampleData[i].push(Object.assign({}, this.randomEntry));
        }
      }
    });
  }

  /**
   * [_getTotalLoggedTimeForDay description]
   * @param  {Object} day
   * @return {Number}
   */
  _getTotalLoggedTimeForDay(day, date) {
    let totalLoggedTime = 0,
        totalExistingTime = 0;
    let existing = this.preexistingData.filter(item => item.Dt === date);
    existing.forEach(e => totalLoggedTime = Number(totalLoggedTime + e.Hours_IN));
    day.forEach(entry => totalLoggedTime = Number(totalLoggedTime + entry.hours));
    // console.log(`--- ${date} ---`)
    // console.log('existing:', totalExistingTime)
    // console.log('total:', totalLoggedTime, `(${existing.length} existing)`)
    return totalLoggedTime;
  }

  /**
   * [_getRandomEntry description]
   * @return {undefined} [description]
   */
  _setRandomEntry() {
    let randomIndex = Number(Math.floor(Math.random() * this.weightedProjectData.length)),
        randomEntry = this.weightedProjectData[randomIndex];
    this.randomEntry = randomEntry;
  }

  /**
   * [_getRandomTime description]
   * @return {undefined} [description]
   */
  _setRandomTime() {
    let increments = 60 / Number(process.env.BIGTIME_SAMPLE_TIME_INCREMENT_MINUTES),
        percentage = 100 / increments,
        method = Math.random() < 0.5 ? 'ceil' : 'floor',
        hours = Math[method](this.randomEntry.averageEntryHours),
        minutes = (Math.floor(Math.random() * increments) * percentage) / 100,
        total = Number(hours + minutes);
    this.randomTime = total;
  }

  /**
   * [_displayAndPrompt description]
   * @return {undefined}
   */
  _displaySampleData() {
    this.sampleData.forEach((day, i) => {
      if (day.length) {
        let entryLabel = day.length === 1 ? 'entry' : 'entries',
            dateLabel = moment(day[0].date).format('ddd MMMM DD, YYYY'),
            divider = day.length === 1 ? '---------------------------' : '-----------------------------',
            total = 0;
        logger.info(`${dateLabel} (${day.length} ${entryLabel})`);
        console.log(divider);
        day.forEach(entry => {
          total += entry.hours;
          let hourLabel = entry.hours === 1 ? 'hour' : 'hours';
          console.log(`${entry.projectName}: ${entry.hours} ${hourLabel}`);
        });
        logger.info(`TOTAL: ${total}`);
        console.log('');
      } else {
        console.log('(No entries for this date. Preexisting entries were found.)');
        console.log('');
      }
    });
  }

  /**
   * [_prompt description]
   * @return {Promise}
   */
  _prompt() {
    return inquirer.prompt(prompts.sample.confirmSubmit);
  }

  /**
   * [_queue description]
   * @return {undefined} [description]
   */
  _queue() {
    this.sampleData.forEach((day) => {
      day.forEach(entry => {
        createTimeEntryQueue.push(entry);
      });
    });
  }

}

/**
 * [reduceEntry description]
 * @param  {Object} entry
 * @return {Object}
 */
function reduceEntry (entry) {
  return {
    Dt: entry.Dt,
    ProjectNm: entry.ProjectNm,
    ProjectSID: entry.ProjectSID,
    ClientNm: entry.ClientNm,
    ClientID: entry.ClientID,
    BudgCatNm: entry.BudgCatNm,
    BudgCatID: entry.BudgCatID,
    Hours_IN: entry.Hours_IN
  };
}

module.exports = Sample;