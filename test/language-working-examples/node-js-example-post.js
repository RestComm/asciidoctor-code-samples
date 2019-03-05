const request = require('request');

const restcommDomain = 'mycompany.restcomm.com';
const accountSid = 'YourAccountSid';
const authToken = 'YourAuthToken';

request({
    method: 'POST',
    url: 'https://' + restcommDomain + '/restcomm/2012-04-24/Accounts/' + accountSid + '/SMS/Messages.json',
    auth: { 'user': accountSid, 'pass': authToken },
    form: {
      'From': '19876543212',
      'To': '13216549878',
      'Body': 'Test SMS from Restcomm',
      'StatusCallback': 'http://status.callback.url'
    }
  },
  function (error, response, body) {
    console.log("Status code: " + response.statusCode + "\nBody: " + body);
  });
