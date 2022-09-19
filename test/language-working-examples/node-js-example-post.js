const request = require('request');

// Provide your Account Sid and Auth Token from your Console Account page
const ACCOUNT_SID = 'my_ACCOUNT_SID';
const AUTH_TOKEN = 'my_AUTH_TOKEN';

request.({
    method: 'POST',
    url: 'https://mycompany.restcomm.com/api/2012-04-24/Accounts/' + ACCOUNT_SID + '/SMS/Messages.json',
    auth: { 'user': ACCOUNT_SID, 'pass': AUTH_TOKEN },
    form: {
      'From': '19876543212',
      'To': '13216549878',
      'Body': 'Test SMS from Restcomm',
      'StatusCallback': 'http://status.callback.url'
    },
    headers: {
      'X-Header-1': 'Value1',
      'X-Header-2': 'Value2'
    }
  },
  function (error, response, body) {
    // Add your business logic below; status can be found at 'response.statusCode' and response body at 'body'
    console.log("Status code: " + response.statusCode + "\nBody: " + body);
  });
