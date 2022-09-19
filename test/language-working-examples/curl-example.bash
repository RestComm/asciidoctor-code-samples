#!/bin/bash

curl -X GET https://mycompany.restcomm.com/api/2012-04-24/Accounts/ACCOUNT_SID/SMS/Messages.json \
   -H 'X-Header-1: Value1' \
   -H 'X-Header-2: Value2' \
   -u 'YourAccountSid:YourAuthToken'
