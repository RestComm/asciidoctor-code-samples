const request = require('request');

const RESTCOMM_DOMAIN = 'mycompany.restcomm.com';
const accountSid = 'YourAccountSid';
const authToken = 'YourAuthToken';

request({
    method: 'GET',
    url: 'https://' + RESTCOMM_DOMAIN + '/restcomm/2012-04-24/Accounts/' + accountSid + '/SMS/Messages.json',
    auth: {'user': accountSid, 'pass': authToken},
  },
  function (error, response, body) {
    console.log("Status code: " + response.statusCode + "\nBody: " + body);
  }
);
