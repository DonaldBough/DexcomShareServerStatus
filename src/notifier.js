'use strict'

module.exports = class Notifier {
  constructor(dexcomStatusService, channels) {
    this.dexcomStatusService = dexcomStatusService;
    this.channels = channels;
  }
  
  notifyOnBadResponse() {
    if (await this.isDexcomShareOkay())
      return;
      
    this.channels.forEach(channel => {
      await channel.notify();
    });
  }
  
  async isDexcomShareOkay() {
    let statusCode = await this.dexcomStatusService.getStatus();
    
    if (statusCode >= 500 && < 600)
      return false;
    return true;
  }
}