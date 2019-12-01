'use strict'

const axios = require('axios');

module.exports = class DexcomStatusService {
  async getStatus() {
    try {
        let response = await axios.get('https://share1.dexcom.com');
    
        if (!response || !response.status)
          return Error('No status on response from Dexcom Share api');
        return response.status;
    } catch (e) {
        return e;
    }
  }
}