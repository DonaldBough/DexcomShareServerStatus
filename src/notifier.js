'use strict';

let moment = require('moment');

module.exports = class Notifier {
  constructor(dexcomStatusService, channels) {
    this.dexcomStatusService = dexcomStatusService;
    this.channels = channels;
    this.timeLastNotified = null;
    this.notifyEveryHours = 24;
  }
  
  async notifyOnBadResponse() {
    if (await this.isDexcomShareOkay())
      return;
    if (this._alreadyNotifiedInTimeLimit())
      return;
    this.timeLastNotified = moment();

    return await Promise.all(this.channels.map(channel => {
      channel.post();
    }));
  }
  
  async isDexcomShareOkay() {
    let statusCode = await this.dexcomStatusService.getStatus();
    
    if (statusCode >= 500 && statusCode < 600)
      return false;
    return true;
  }

  _alreadyNotifiedInTimeLimit() {
    let timeSinceLastNotification = moment.duration(moment().diff(this.timeLastNotified, "hours"));

    if (timeSinceLastNotification < this.notifyEveryHours)
      return true;
    return false;
  }
};