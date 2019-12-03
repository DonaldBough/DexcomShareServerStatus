'use strict';

let chai = require('chai');
let sinon = require('sinon');
let FacebookChannel = require('../src/facebook-channel');

describe('FacebookChannel', () => {
  it('gets the url for posting to the facebook wall with config values', async () => {
    //arrange
    let facebookChannel = new FacebookChannel();
    facebookChannel.ChannelConfig = {
      facebook: {
        accessToken: "1234",
        appId: "abcd"
      }
    };
    //act
    let url = facebookChannel._getPostUrl();
    //assert
    chai.expect(url).to.equal('https://graph.facebook.com/abcd?fields=access_token&access_token=1234');
  });

  it('returns status code from a mocked post request', async () => {
    //arrange
    let facebookChannel = new FacebookChannel();
    facebookChannel.axios = mockAxiosWithOkayResponse;
    //act
    let statusCode = await facebookChannel.post();
    //assert
    chai.expect(statusCode).to.equal(200);
  });

  it('returns error when something went wrong with the request and not the actual Facebook response', async () => {
    //arrange
    let facebookChannel = new FacebookChannel();
    facebookChannel.axios = mockAxiosWithNetworkFailure;
    //act
    let statusCode = await facebookChannel.post();
    //assert
    chai.expect(statusCode instanceof Error).to.be.true;
  });
});

let mockAxiosWithOkayResponse = {
  async post() {
    return new Promise(function(resolve) {
      resolve({status: 200});
    });
  }
};

let mockAxiosWithNetworkFailure = {
  async post() {
    return new Promise(function(resolve, reject) {
      reject(new Error("There was a problem with the network"));
    });
  }
};