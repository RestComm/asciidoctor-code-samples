#!/bin/bash

curl -X POST https://mycompany.restcomm.com/restcomm/2012-04-24/Accounts/ACCOUNT_SID/SMS/Messages.json \
   -H 'X-Header-1: Value1' \
   -H 'X-Header-2: Value2' \
   -d 'From=19876543212' \
   -d 'To=13216549878' \
   -d 'Body=Test SMS from Restcomm' \
   -d 'StatusCallback=http://status.callback.url' \
   -u 'YourAccountSid:YourAuthToken'
