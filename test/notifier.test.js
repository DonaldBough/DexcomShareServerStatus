'use strict';

let chai = require('chai');
let sinon = require('sinon');
let moment = require('moment');
const Notifier = require('../src/notifier.js');

describe('Notifier', () => {
  afterEach(function () {
    sinon.restore();
  });

  it('returns true when Dexcom Share api returns a good status code', async () => {
    //arrange
    let dexcomStatusService = {getStatus: () => 200};
    let notifier = new Notifier(dexcomStatusService, []);
    //act
    let result = await notifier.isDexcomShareOkay();
    //assert
    chai.expect(result).to.be.true;
  });

  it('returns false when Dexcom Share api returns a bad status code', async () => {
    //arrange
    let dexcomStatusService = {getStatus: () => 500};
    let notifier = new Notifier(dexcomStatusService, []);
    //act
    let result = await notifier.isDexcomShareOkay();
    //assert
    chai.expect(result).to.be.false;
  });

  it('notifies channels when it receives a bad error code', async () => {
    //arrange
    let dexcomStatusService = {getStatus: () => 500};
    let fakeChannel1 = sinon.spy({async post() {}});
    let fakeChannel2 = sinon.spy({async post() {}});
    let fakeChannel3 = sinon.spy({async post() {}});
    let channels = [fakeChannel1, fakeChannel2, fakeChannel3];

    let notifier = new Notifier(dexcomStatusService, channels);
    //act
    await notifier.notifyOnBadResponse();
    //assert
    chai.expect(fakeChannel1.post.calledOnce).to.be.true;
    chai.expect(fakeChannel2.post.calledOnce).to.be.true;
    chai.expect(fakeChannel3.post.calledOnce).to.be.true;
  });

  it('doesnt post to channels if a post was made within 24 hours', async () => {
    //arrange
    let dexcomStatusService = {getStatus: () => 500};
    let channels = [{async post() {}}];
    let notifier = new Notifier(dexcomStatusService, channels);
    sinon.spy(notifier.channels[0], "post");
    //act
    await notifier.notifyOnBadResponse();
    await notifier.notifyOnBadResponse();
    //assert
    chai.expect(notifier.channels[0].post.calledOnce).to.be.true;
  });

  it('posts to channels again after 24 hours', async () => {
    //arrange
    let dexcomStatusService = {getStatus: () => 500};
    let channels = [{async post() {}}];
    let notifier = new Notifier(dexcomStatusService, channels);
    sinon.spy(notifier.channels[0], "post");

    //act
    await notifier.notifyOnBadResponse();
    notifier.timeLastNotified = moment().subtract(24, 'hours');
    await notifier.notifyOnBadResponse();
    //assert
    chai.expect(notifier.channels[0].post.calledTwice).to.be.true;
  });
});

