from http.client import HTTPSConnection
from base64 import b64encode

# Provide your Account Sid and Auth Token from your Console Account page
ACCOUNT_SID = 'my_ACCOUNT_SID'
AUTH_TOKEN = 'my_AUTH_TOKEN'

userAndPass = b64encode(bytes(ACCOUNT_SID + ':' + AUTH_TOKEN, 'utf-8')).decode("ascii")
headers = { 'Authorization' : 'Basic %s' %  userAndPass,
  'X-Header-1': 'Value1',
  'X-Header-2': 'Value2' }

conn = HTTPSConnection('mycompany.restcomm.com')
conn.request("GET", '/restcomm/2012-04-24/Accounts/' + ACCOUNT_SID + '/SMS/Messages.json',
      headers=headers)
res = conn.getresponse()

# Add your business logic below; status can be found at 'res.status', reason at 'res.reason' and response body can be retrieved with res.read()
print('Response: ' + str(res.status))
