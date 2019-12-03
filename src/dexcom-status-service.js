'use strict';

const axios = require('axios');

module.exports = class DexcomStatusService {
  constructor() {
    this.axios = axios;
  }

  async getStatus() {
    try {
        let response = await this.axios.get('https://share1.dexcom.com');
    
        if (!response || !response.status)
          return Error('No status on response from Dexcom Share api');
        return response.status;
    } catch (e) {
      return e;
    }
  }
};