'use strict';

const Messages = require('./messages.js');
const ChannelConfig = require('../src/channel-config');
const axios = require("axios");

module.exports = class FacebookChannel {
  constructor() {
    this.axios = axios;
    this.ChannelConfig = ChannelConfig;
  }

  async post() {
    let postUrl = this._getPostUrl();

    try {
      let response = await this.axios.post(postUrl);

      if (!response || !response.status)
        return Error('No status on response from Facebook api');
      return response.status;
    } catch (e) {
      return e;
    }
  }

  //TODO fix this to be the right post url with message
  _getPostUrl() {
    return 'https://graph.facebook.com/' +
        `${this.ChannelConfig.facebook.appId}?fields=access_token` +
        `&access_token=${this.ChannelConfig.facebook.accessToken}`;
  }
};