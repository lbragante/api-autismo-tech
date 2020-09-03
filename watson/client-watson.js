const AssistantV2 = require('ibm-watson/assistant/v2');
const { BasicAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
  version: '2020-04-01',
  authenticator: new BasicAuthenticator({
    username: 'apikey',
    password: 'SnnfN_BYFR5qi-NjGl5jH4jVt8rPquvKtxrUCzSpz92y',
  }),
  serviceUrl: 'https://gateway.watsonplatform.net/assistant/api/',
});

module.exports = assistant;