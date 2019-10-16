const request = require('request');

const RESTCOMM_DOMAIN = 'mycompany.restcomm.com';
const ACCOUNT_SID = 'YourAccountSid';
const AUTH_TOKEN = 'YourAuthToken';

request({
    method: 'GET',
    url: 'https://' + RESTCOMM_DOMAIN + '/restcomm/2012-04-24/Accounts/' + ACCOUNT_SID + '/SMS/Messages.json',
    auth: { 'user': ACCOUNT_SID, 'pass': AUTH_TOKEN },
    headers: {
      'X-Header-1': 'Value1',
      'X-Header-2': 'Value2'
    }
  },
  function (error, response, body) {
    // Add your business logic below; status can be found at 'response.statusCode' and response body at 'body'
    console.log("Status code: " + response.statusCode + "\nBody: " + body);
  }
);
