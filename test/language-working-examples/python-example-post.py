from http.client import HTTPSConnection
from base64 import b64encode
from urllib.parse import urlencode

# Provide your Account Sid and Auth Token from your Console Account page
ACCOUNT_SID = 'my_ACCOUNT_SID'
AUTH_TOKEN = 'my_AUTH_TOKEN'
${attrs.additionalParameters}

userAndPass = b64encode(bytes(ACCOUNT_SID + ':' + AUTH_TOKEN, 'utf-8')).decode("ascii")
headers = { 'Authorization' : 'Basic %s' %  userAndPass ${attrs.normalizedHeaderParameters},
    'Content-type': 'application/x-www-form-urlencoded',
    'Accept': 'text/plain' }

# Update POST parameters accordingly
params = urlencode({
${attrs.normalizedBodyParameters}
})

conn = HTTPSConnection('mycompany.restcomm.com')
conn.request("${attrs.httpMethod}", '/api/2012-04-24/${attrs.urlSuffix}',
      params, headers=headers)
res = conn.getresponse()

// Add your business logic below; status can be found at 'res.status', reason at 'res.reason' and response body can be retrieved with res.read()
...
