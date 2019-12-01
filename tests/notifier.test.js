'use strict';

let chai = require('chai');
let sinon = require('sinon');
const FakeChannel = require('./fake-channel.js');

describe('Notifier', () => {
  it('returns true when Dexcom Share api returns a good status code', async () => {
    //arrange
    let notifier = new Notifier();
    notifier.dexcomStatusService.getStatus = () => 200;
    //act
    let result = await notifier.isDexcomShareOkay();
    
    //assert
    chai.expect(result).to.be.true;
  });
  
  it('returns false when Dexcom Share api returns a bad status code', async () => {
    //arrange
    let notifier = new Notifier();
    notifier.dexcomStatusService.getStatus = () => 500;
    //act
    let result = await notifier.isDexcomShareOkay();
    
    //assert
    chai.expect(result).to.be.false;
  });
  
  it('notifies channels when it receives a bad error code', async () => {
    //arrange
    let dexcomStatusService = {getStatus: () => 500};
    let channels = [new FakeChannel()];
    let notifier = new Notifier(dexcomStatusService, channels);
    
    //act
    await notifier.notifyOnBadResponse();
    
    //assert
    notifier.channels.forEach(channel => {
      chai.expect(channel.notify.calledOnce).to.be.true;
    });
  });
});

