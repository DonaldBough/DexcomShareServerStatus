'use strict';

let chai = require('chai');
const DexcomStatusService = require('../src/dexcom-status-service.js');

describe('DexcomStatusService', () => {
  it('returns status code from a mocked api request', async () => {
    //arrange
    let dexcomStatusService = new DexcomStatusService();
    dexcomStatusService.axios = mockWithOkayResponse;
    //act
    let statusCode = await dexcomStatusService.getStatus();
    //assert
    chai.expect(statusCode).to.equal(200);
  });
  
  it('returns error when something went wrong with the request and not the actual Dexcom response', async () => {
    //arrange
    let dexcomStatusService = new DexcomStatusService();
    dexcomStatusService.axios = mockWithNetworkFailure;
    //act
    let statusCode = await dexcomStatusService.getStatus();
    //assert
    chai.expect(statusCode instanceof Error).to.be.true;
  });
});
  
async function mockWithOkayResponse() {
  return new Promise(function(resolve) {
    resolve({status: 200});
  });
}

async function mockWithNetworkFailure() {
  return new Promise(function(resolve, reject) {
    reject("Network response was not ok.");
  });
}