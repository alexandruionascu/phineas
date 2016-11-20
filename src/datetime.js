var moment = require('moment');

class DateTimeHelper {
    constructor() {
    }
    /**
     * Returns dateStr in Unix timestamp format.
     * @param {string} Any date format.
     *                 For example, 11.08.2012 and 11-08-2012 are both valid.
     * @return {int}   Unix timestamp format, representing number of
     *                 seconds since Jan 01 1970.
     */
    static getUnixTimeStampFromDate(dateStr) {
      return (new Date(dateStr).getTime() / 1000);
    }


    static getDateFromUnixTimeStamp(unixTimeStampStr) {
      return (moment.unix(unixTimeStampStr).format("DD-MM-YYYY HH:mm:ss"));
    }
}

export { DateTimeHelper };
