const request = require('request');

const restcommDomain = 'mycompany.restcomm.com';
const accountSid = 'YourAccountSid';
const authToken = 'YourAuthToken';

request({
    method: 'GET',
    url: 'https://' + restcommDomain + '/restcomm/2012-04-24/Accounts/' + accountSid + '/SMS/Messages.json',
    auth: {'user': accountSid, 'pass': authToken},
  },
  function (error, response, body) {
    console.log("Status code: " + response.statusCode + "\nBody: " + body);
  }
);
