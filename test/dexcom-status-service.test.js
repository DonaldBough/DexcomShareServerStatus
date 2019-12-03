'use strict';

let chai = require('chai');
const DexcomStatusService = require('../src/dexcom-status-service.js');

describe('DexcomStatusService', () => {
  it('returns status code from a mocked get request', async () => {
    //arrange
    let dexcomStatusService = new DexcomStatusService();
    dexcomStatusService.axios = mockAxiosWithOkayResponse;
    //act
    let statusCode = await dexcomStatusService.getStatus();
    //assert
    chai.expect(statusCode).to.equal(200);
  });

  it('returns error when something went wrong with the request and not the actual Dexcom response', async () => {
    //arrange
    let dexcomStatusService = new DexcomStatusService();
    dexcomStatusService.axios = mockAxiosWithNetworkFailure;
    //act
    let statusCode = await dexcomStatusService.getStatus();
    //assert
    chai.expect(statusCode instanceof Error).to.be.true;
  });
});

let mockAxiosWithOkayResponse = {
  async get() {
    return new Promise(function(resolve) {
      resolve({status: 200});
    });
  }
};

let mockAxiosWithNetworkFailure = {
  async get() {
    return new Promise(function(resolve, reject) {
      reject(new Error("There was a problem with the network"));
    });
  }
};