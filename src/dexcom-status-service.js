'use strict'

const axios = require('axios');
const StatusCodes = require('./status-codes.js');

module.exports = class DexcomStatusService {
  async getStatus() {
    try {
        let response = await axios.get('https://share1.dexcom.com');
    
        return StatusCodes.2XX;
    } catch (e) {
        return e;
    }
  }
}