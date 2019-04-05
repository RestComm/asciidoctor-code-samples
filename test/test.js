const chai = require('chai');
const expect = chai.expect;
const dirtyChai = require('dirty-chai');

chai.use(dirtyChai);

const asciidoctorCodeSamples = require('../src/asciidoctor-code-samples');
const asciidoctor = require('asciidoctor.js')();

// Expected results for GET methods
const expectedOutputCurlGet = 'curl -X GET https://mycompany.restcomm.com/restcomm/2012-04-24/Accounts/ACCOUNT_SID/SMS/Messages.json \\\n' +
  '   -u "YourAccountSid:YourAuthToken"';
const expectedOutputNodeGet = 'const request = require(\'request\');\n' +
  '\n' +
  '// Change \'mycompany\' to the desired restcomm organization\n' +
  'const RESTCOMM_DOMAIN = \'mycompany.restcomm.com\';\n' +
  'const ACCOUNT_SID = \'my_ACCOUNT_SID\';\n' +
  'const AUTH_TOKEN = \'my_AUTH_TOKEN\';\n' +
  '\n' +
  'request({\n' +
  '      method: \'GET\',\n' +
  '      url: \'https://\' + RESTCOMM_DOMAIN + \'/restcomm/2012-04-24/Accounts/\' + ACCOUNT_SID + \'/SMS/Messages.json\',\n' +
  '      auth: { \'user\': ACCOUNT_SID, \'pass\': AUTH_TOKEN },\n' +
  '   },\n' +
  '   function (error, response, body) {\n' +
  '      // Add your business logic below; status can be found at \'response.statusCode\' and response body at \'body\'\n' +
  '      ...\n' +
  '   }\n' +
  ');';
const expectedOutputPythonGet = 'from http.client import HTTPSConnection\n' +
  'from base64 import b64encode\n' +
  '\n' +
  '# Change \'mycompany\' to the desired restcomm organization\n' +
  'RESTCOMM_DOMAIN = \'mycompany.restcomm.com\'\n' +
  '# Provide your Account Sid and Auth Token from your Console Account page\n' +
  'ACCOUNT_SID = \'my_ACCOUNT_SID\'\n' +
  'AUTH_TOKEN = \'my_AUTH_TOKEN\'\n' +
  '\n' +
  'userAndPass = b64encode(bytes(ACCOUNT_SID + \':\' + AUTH_TOKEN, \'utf-8\')).decode("ascii")\n' +
  'headers = { \'Authorization\' : \'Basic %s\' %  userAndPass }\n' +
  '\n' +
  'conn = HTTPSConnection(RESTCOMM_DOMAIN)\n' +
  'conn.request("GET", \'/restcomm/2012-04-24/Accounts/\' + ACCOUNT_SID + \'/SMS/Messages.json\',\n' +
  '      headers=headers)\n' +
  'res = conn.getresponse()\n' +
  '\n' +
  '// Add your business logic below; status can be found at \'res.status\', reason at \'res.reason\' and response body can be retrieved with res.read()\n' +
  '...';
const expectedOutputJavaGet = 'import java.net.URL;\n' +
  'import javax.net.ssl.HttpsURLConnection;\n' +
  'import java.io.*;\n' +
  'import java.util.Base64;\n' +
  '\n' +
  'public class JavaSampleClass {\n' +
  '   // Change \'mycompany\' to the desired restcomm organization\n' +
  '   public static final String RESTCOMM_DOMAIN = "mycompany.restcomm.com";\n' +
  '   // Provide your Account Sid and Auth Token from your Console Account page\n' +
  '   public static final String ACCOUNT_SID = "my_ACCOUNT_SID";\n' +
  '   public static final String AUTH_TOKEN = "my_AUTH_TOKEN";\n' +
  '\n' +
  '\n' +
  '   public static void main(String[] args) throws Exception {\n' +
  '      String userAndPass = ACCOUNT_SID + \':\' + AUTH_TOKEN;\n' +
  '      String encoded = Base64.getEncoder().encodeToString(userAndPass.getBytes());\n' +
  '\n' +
  '      URL url = new URL("https://" + RESTCOMM_DOMAIN + "/restcomm/2012-04-24/Accounts/" + ACCOUNT_SID + "/SMS/Messages.json");\n' +
  '      HttpsURLConnection conn = (HttpsURLConnection)url.openConnection();\n' +
  '      conn.setRequestProperty("Authorization", "Basic " + encoded);\n' +
  '      conn.setRequestMethod("GET");\n' +
  '\n' +
  '      // Add your business logic below; response code can be obtained from \'conn.getResponseCode()\' and input stream from \'conn.getInputStream()\'\n' +
  '      ...\n' +
  '  }\n' +
  '}';

// Expected results for POST methods
const expectedOutputCurlPost = 'curl -X POST https://mycompany.restcomm.com/restcomm/2012-04-24/Accounts/ACCOUNT_SID/SMS/Messages.json \\\n' +
  '   -d \'From=19876543212\' \\\n' +
  '   -d \'To=13216549878\' \\\n' +
  '   -d \'Body=Test SMS from Restcomm\' \\\n' +
  '   -d \'StatusCallback=http://status.callback.url\' \\\n' +
  '   -u \'YourAccountSid:YourAuthToken\''
const expectedOutputNodePost = 'const request = require(\'request\');\n' +
  '\n' +
  '// Change \'mycompany\' to the desired restcomm organization\n' +
  'const RESTCOMM_DOMAIN = \'mycompany.restcomm.com\';\n' +
  'const ACCOUNT_SID = \'my_ACCOUNT_SID\';\n' +
  'const AUTH_TOKEN = \'my_AUTH_TOKEN\';\n' +
  '\n' +
  'request.({\n' +
  '      method: \'POST\',\n' +
  '      url: \'https://\' + RESTCOMM_DOMAIN + \'/restcomm/2012-04-24/Accounts/\' + ACCOUNT_SID + \'/SMS/Messages.json\',\n' +
  '      auth: { \'user\': ACCOUNT_SID, \'pass\': AUTH_TOKEN },\n' +
  '      form: {\n' +
  '         \'From\': \'19876543212\',\n' +
  '         \'To\': \'13216549878\',\n' +
  '         \'Body\': \'Test SMS from Restcomm\',\n' +
  '         \'StatusCallback\': \'http://status.callback.url\'\n' +
  '      }\n' +
  '   },\n' +
  '   function (error, response, body) {\n' +
  '      // Add your business logic below; status can be found at \'response.statusCode\' and response body at \'body\'\n' +
  '      ...\n' +
  '});';
const expectedOutputPythonPost = 'from http.client import HTTPSConnection\n' +
  'from base64 import b64encode\n' +
  'from urllib.parse import urlencode\n' +
  '\n' +
  '# Change \'mycompany\' to the desired restcomm organization\n' +
  'RESTCOMM_DOMAIN = \'mycompany.restcomm.com\'\n' +
  '# Provide your Account Sid and Auth Token from your Console Account page\n' +
  'ACCOUNT_SID = \'my_ACCOUNT_SID\'\n' +
  'AUTH_TOKEN = \'my_AUTH_TOKEN\'\n' +
  '\n' +
  'userAndPass = b64encode(bytes(ACCOUNT_SID + \':\' + AUTH_TOKEN, \'utf-8\')).decode("ascii")\n' +
  'headers = { \'Authorization\' : \'Basic %s\' %  userAndPass,\n' +
  '            \'Content-type\': \'application/x-www-form-urlencoded\',\n' +
  '            \'Accept\': \'text/plain\' }\n' +
  '\n' +
  '# Update POST parameters accordingly\n' +
  'params = urlencode({\n' +
  '   \'From\': \'19876543212\',\n' +
  '   \'To\': \'13216549878\',\n' +
  '   \'Body\': \'Test SMS from Restcomm\',\n' +
  '   \'StatusCallback\': \'http://status.callback.url\'\n' +
  '})\n' +
  '\n' +
  'conn = HTTPSConnection(RESTCOMM_DOMAIN)\n' +
  'conn.request("POST", \'/restcomm/2012-04-24/Accounts/\' + ACCOUNT_SID + \'/SMS/Messages.json\',\n' +
  '      params, headers=headers)\n' +
  'res = conn.getresponse()\n' +
  '\n' +
  '// Add your business logic below; status can be found at \'res.status\', reason at \'res.reason\' and response body can be retrieved with res.read()\n' +
  '...';
const expectedOutputJavaPost = 'import java.net.URL;\n' +
  'import javax.net.ssl.HttpsURLConnection;\n' +
  'import java.io.*;\n' +
  'import java.util.Base64;\n' +
  '\n' +
  'public class JavaSampleClass {\n' +
  '   // Change \'mycompany\' to the desired restcomm organization\n' +
  '   public static final String RESTCOMM_DOMAIN = "mycompany.restcomm.com";\n' +
  '   // Provide your Account Sid and Auth Token from your Console Account page\n' +
  '   public static final String ACCOUNT_SID = "my_ACCOUNT_SID";\n' +
  '   public static final String AUTH_TOKEN = "my_AUTH_TOKEN";\n' +
  '\n' +
  '\n' +
  '   public static void main(String[] args) throws Exception {\n' +
  '      String userAndPass = ACCOUNT_SID + \':\' + AUTH_TOKEN;\n' +
  '      String encoded = Base64.getEncoder().encodeToString(userAndPass.getBytes());\n' +
  '\n' +
  '      URL url = new URL(("https://" + RESTCOMM_DOMAIN + "/restcomm/2012-04-24/Accounts/" + ACCOUNT_SID + "/SMS/Messages.json");\n' +
  '      HttpsURLConnection conn = (HttpsURLConnection)url.openConnection();\n' +
  '      conn.setRequestProperty("Authorization", "Basic " + encoded);\n' +
  '      conn.setRequestMethod("POST");\n' +
  '      conn.setDoOutput(true);\n' +
  '      DataOutputStream os = new DataOutputStream(conn.getOutputStream());\n' +
  '\n' +
  '      // Update POST parameters accordingly\n' +
  '      os.writeBytes("From=19876543212&" +\n' +
  '        "To=13216549878&" +\n' +
  '        "Body=Test SMS from Restcomm&" +\n' +
  '        "StatusCallback=http://status.callback.url");\n' +
  '      os.close();\n' +
  '\n' +
  '      // Add your business logic below; response code can be obtained from \'conn.getResponseCode()\' and input stream from \'conn.getInputStream()\'\n' +
  '      ...\n' +
  '  }\n' +
  '}';

const expectedOutputCurlPut = 'curl -X PUT https://mycompany.restcomm.com/restcomm/2012-04-24/Accounts/ACCOUNT_SID.xml \\\n' +
  '   -d \'Password=NewPassword\' \\\n' +
  '   -u \'YourAccountSid:YourAuthToken\'';
const expectedOutputNodePut = 'const request = require(\'request\');\n' +
  '\n' +
  '// Change \'mycompany\' to the desired restcomm organization\n' +
  'const RESTCOMM_DOMAIN = \'mycompany.restcomm.com\';\n' +
  'const ACCOUNT_SID = \'my_ACCOUNT_SID\';\n' +
  'const AUTH_TOKEN = \'my_AUTH_TOKEN\';\n' +
  '\n' +
  'request.({\n' +
  '      method: \'PUT\',\n' +
  '      url: \'https://\' + RESTCOMM_DOMAIN + \'/restcomm/2012-04-24/Accounts/\' + ACCOUNT_SID + \'.xml\',\n' +
  '      auth: { \'user\': ACCOUNT_SID, \'pass\': AUTH_TOKEN },\n' +
  '      form: {\n' +
  '         \'Password\': \'NewPassword\'\n' +
  '      }\n' +
  '   },\n' +
  '   function (error, response, body) {\n' +
  '      // Add your business logic below; status can be found at \'response.statusCode\' and response body at \'body\'\n' +
  '      ...\n' +
  '});';
const expectedOutputPythonPut = 'from http.client import HTTPSConnection\n' +
  'from base64 import b64encode\n' +
  'from urllib.parse import urlencode\n' +
  '\n' +
  '# Change \'mycompany\' to the desired restcomm organization\n' +
  'RESTCOMM_DOMAIN = \'mycompany.restcomm.com\'\n' +
  '# Provide your Account Sid and Auth Token from your Console Account page\n' +
  'ACCOUNT_SID = \'my_ACCOUNT_SID\'\n' +
  'AUTH_TOKEN = \'my_AUTH_TOKEN\'\n' +
  '\n' +
  'userAndPass = b64encode(bytes(ACCOUNT_SID + \':\' + AUTH_TOKEN, \'utf-8\')).decode("ascii")\n' +
  'headers = { \'Authorization\' : \'Basic %s\' %  userAndPass,\n' +
  '            \'Content-type\': \'application/x-www-form-urlencoded\',\n' +
  '            \'Accept\': \'text/plain\' }\n' +
  '\n' +
  '# Update POST parameters accordingly\n' +
  'params = urlencode({\n' +
  '   \'Password\': \'NewPassword\'\n' +
  '})\n' +
  '\n' +
  'conn = HTTPSConnection(RESTCOMM_DOMAIN)\n' +
  'conn.request("PUT", \'/restcomm/2012-04-24/Accounts/\' + ACCOUNT_SID + \'.xml\',\n' +
  '      params, headers=headers)\n' +
  'res = conn.getresponse()\n' +
  '\n' +
  '// Add your business logic below; status can be found at \'res.status\', reason at \'res.reason\' and response body can be retrieved with res.read()\n' +
  '...';
const expectedOutputJavaPut = 'import java.net.URL;\n' +
  'import javax.net.ssl.HttpsURLConnection;\n' +
  'import java.io.*;\n' +
  'import java.util.Base64;\n' +
  '\n' +
  'public class JavaSampleClass {\n' +
  '   // Change \'mycompany\' to the desired restcomm organization\n' +
  '   public static final String RESTCOMM_DOMAIN = "mycompany.restcomm.com";\n' +
  '   // Provide your Account Sid and Auth Token from your Console Account page\n' +
  '   public static final String ACCOUNT_SID = "my_ACCOUNT_SID";\n' +
  '   public static final String AUTH_TOKEN = "my_AUTH_TOKEN";\n' +
  '\n' +
  '\n' +
  '   public static void main(String[] args) throws Exception {\n' +
  '      String userAndPass = ACCOUNT_SID + \':\' + AUTH_TOKEN;\n' +
  '      String encoded = Base64.getEncoder().encodeToString(userAndPass.getBytes());\n' +
  '\n' +
  '      URL url = new URL(("https://" + RESTCOMM_DOMAIN + "/restcomm/2012-04-24/Accounts/" + ACCOUNT_SID + ".xml");\n' +
  '      HttpsURLConnection conn = (HttpsURLConnection)url.openConnection();\n' +
  '      conn.setRequestProperty("Authorization", "Basic " + encoded);\n' +
  '      conn.setRequestMethod("PUT");\n' +
  '      conn.setDoOutput(true);\n' +
  '      DataOutputStream os = new DataOutputStream(conn.getOutputStream());\n' +
  '\n' +
  '      // Update POST parameters accordingly\n' +
  '      os.writeBytes("Password=NewPassword");\n' +
  '      os.close();\n' +
  '\n' +
  '      // Add your business logic below; response code can be obtained from \'conn.getResponseCode()\' and input stream from \'conn.getInputStream()\'\n' +
  '      ...\n' +
  '  }\n' +
  '}';

const expectedOutputCurlGetMultivar = 'curl -X GET https://mycompany.restcomm.com/restcomm/2012-04-24/Accounts/ACCOUNT_SID/SMS/Messages/MESSAGE_SID.json \\\n' +
  '   -u "YourAccountSid:YourAuthToken"';
const expectedOutputNodeGetMultivar = 'const request = require(\'request\');\n' +
  '\n' +
  '// Change \'mycompany\' to the desired restcomm organization\n' +
  'const RESTCOMM_DOMAIN = \'mycompany.restcomm.com\';\n' +
  'const ACCOUNT_SID = \'my_ACCOUNT_SID\';\n' +
  'const AUTH_TOKEN = \'my_AUTH_TOKEN\';\n' +
  '// Provide additional path parameters if applicable\n' +
  'const MESSAGE_SID = \'my_MESSAGE_SID\'\n' +
  '\n' +
  'request({\n' +
  '      method: \'GET\',\n' +
  '      url: \'https://\' + RESTCOMM_DOMAIN + \'/restcomm/2012-04-24/Accounts/\' + ACCOUNT_SID + \'/SMS/Messages/\' + MESSAGE_SID + \'.json\',\n' +
  '      auth: { \'user\': ACCOUNT_SID, \'pass\': AUTH_TOKEN },\n' +
  '   },\n' +
  '   function (error, response, body) {\n' +
  '      // Add your business logic below; status can be found at \'response.statusCode\' and response body at \'body\'\n' +
  '      ...\n' +
  '   }\n' +
  ');';
const expectedOutputPythonGetMultivar = 'from http.client import HTTPSConnection\n' +
  'from base64 import b64encode\n' +
  '\n' +
  '# Change \'mycompany\' to the desired restcomm organization\n' +
  'RESTCOMM_DOMAIN = \'mycompany.restcomm.com\'\n' +
  '# Provide your Account Sid and Auth Token from your Console Account page\n' +
  'ACCOUNT_SID = \'my_ACCOUNT_SID\'\n' +
  'AUTH_TOKEN = \'my_AUTH_TOKEN\'\n' +
  '// Provide additional path parameters if applicable\n' +
  'MESSAGE_SID = \'my_MESSAGE_SID\'\n' +
  '\n' +
  'userAndPass = b64encode(bytes(ACCOUNT_SID + \':\' + AUTH_TOKEN, \'utf-8\')).decode("ascii")\n' +
  'headers = { \'Authorization\' : \'Basic %s\' %  userAndPass }\n' +
  '\n' +
  'conn = HTTPSConnection(RESTCOMM_DOMAIN)\n' +
  'conn.request("GET", \'/restcomm/2012-04-24/Accounts/\' + ACCOUNT_SID + \'/SMS/Messages/\' + MESSAGE_SID + \'.json\',\n' +
  '      headers=headers)\n' +
  'res = conn.getresponse()\n' +
  '\n' +
  '// Add your business logic below; status can be found at \'res.status\', reason at \'res.reason\' and response body can be retrieved with res.read()\n' +
  '...';
const expectedOutputJavaGetMultivar = 'import java.net.URL;\n' +
  'import javax.net.ssl.HttpsURLConnection;\n' +
  'import java.io.*;\n' +
  'import java.util.Base64;\n' +
  '\n' +
  'public class JavaSampleClass {\n' +
  '   // Change \'mycompany\' to the desired restcomm organization\n' +
  '   public static final String RESTCOMM_DOMAIN = "mycompany.restcomm.com";\n' +
  '   // Provide your Account Sid and Auth Token from your Console Account page\n' +
  '   public static final String ACCOUNT_SID = "my_ACCOUNT_SID";\n' +
  '   public static final String AUTH_TOKEN = "my_AUTH_TOKEN";\n' +
  '   // Provide additional path parameters if applicable\n' +
  '   public static final String MESSAGE_SID = "my_MESSAGE_SID"\n' +
  '\n' +
  '   public static void main(String[] args) throws Exception {\n' +
  '      String userAndPass = ACCOUNT_SID + \':\' + AUTH_TOKEN;\n' +
  '      String encoded = Base64.getEncoder().encodeToString(userAndPass.getBytes());\n' +
  '\n' +
  '      URL url = new URL("https://" + RESTCOMM_DOMAIN + "/restcomm/2012-04-24/Accounts/" + ACCOUNT_SID + "/SMS/Messages/" + MESSAGE_SID + ".json");\n' +
  '      HttpsURLConnection conn = (HttpsURLConnection)url.openConnection();\n' +
  '      conn.setRequestProperty("Authorization", "Basic " + encoded);\n' +
  '      conn.setRequestMethod("GET");\n' +
  '\n' +
  '      // Add your business logic below; response code can be obtained from \'conn.getResponseCode()\' and input stream from \'conn.getInputStream()\'\n' +
  '      ...\n' +
  '  }\n' +
  '}';

const expectedOutputCurlGetNovar = 'curl -X GET https://mycompany.restcomm.com/restcomm/2012-04-24/ExtensionsConfiguration.json \\\n' +
  '   -u "YourAccountSid:YourAuthToken"';
const expectedOutputNodeGetNovar = 'const request = require(\'request\');\n' +
  '\n' +
  '// Change \'mycompany\' to the desired restcomm organization\n' +
  'const RESTCOMM_DOMAIN = \'mycompany.restcomm.com\';\n' +
  'const ACCOUNT_SID = \'my_ACCOUNT_SID\';\n' +
  'const AUTH_TOKEN = \'my_AUTH_TOKEN\';\n' +
  '\n' +
  'request({\n' +
  '      method: \'GET\',\n' +
  '      url: \'https://\' + RESTCOMM_DOMAIN + \'/restcomm/2012-04-24/ExtensionsConfiguration.json\',\n' +
  '      auth: { \'user\': ACCOUNT_SID, \'pass\': AUTH_TOKEN },\n' +
  '   },\n' +
  '   function (error, response, body) {\n' +
  '      // Add your business logic below; status can be found at \'response.statusCode\' and response body at \'body\'\n' +
  '      ...\n' +
  '   }\n' +
  ');';
const expectedOutputPythonGetNovar = 'from http.client import HTTPSConnection\n' +
  'from base64 import b64encode\n' +
  '\n' +
  '# Change \'mycompany\' to the desired restcomm organization\n' +
  'RESTCOMM_DOMAIN = \'mycompany.restcomm.com\'\n' +
  '# Provide your Account Sid and Auth Token from your Console Account page\n' +
  'ACCOUNT_SID = \'my_ACCOUNT_SID\'\n' +
  'AUTH_TOKEN = \'my_AUTH_TOKEN\'\n' +
  '\n' +
  'userAndPass = b64encode(bytes(ACCOUNT_SID + \':\' + AUTH_TOKEN, \'utf-8\')).decode("ascii")\n' +
  'headers = { \'Authorization\' : \'Basic %s\' %  userAndPass }\n' +
  '\n' +
  'conn = HTTPSConnection(RESTCOMM_DOMAIN)\n' +
  'conn.request("GET", \'/restcomm/2012-04-24/ExtensionsConfiguration.json\',\n' +
  '      headers=headers)\n' +
  'res = conn.getresponse()\n' +
  '\n' +
  '// Add your business logic below; status can be found at \'res.status\', reason at \'res.reason\' and response body can be retrieved with res.read()\n' +
  '...';
const expectedOutputJavaGetNovar = 'import java.net.URL;\n' +
  'import javax.net.ssl.HttpsURLConnection;\n' +
  'import java.io.*;\n' +
  'import java.util.Base64;\n' +
  '\n' +
  'public class JavaSampleClass {\n' +
  '   // Change \'mycompany\' to the desired restcomm organization\n' +
  '   public static final String RESTCOMM_DOMAIN = "mycompany.restcomm.com";\n' +
  '   // Provide your Account Sid and Auth Token from your Console Account page\n' +
  '   public static final String ACCOUNT_SID = "my_ACCOUNT_SID";\n' +
  '   public static final String AUTH_TOKEN = "my_AUTH_TOKEN";\n' +
  '\n' +
  '\n' +
  '   public static void main(String[] args) throws Exception {\n' +
  '      String userAndPass = ACCOUNT_SID + \':\' + AUTH_TOKEN;\n' +
  '      String encoded = Base64.getEncoder().encodeToString(userAndPass.getBytes());\n' +
  '\n' +
  '      URL url = new URL("https://" + RESTCOMM_DOMAIN + "/restcomm/2012-04-24/ExtensionsConfiguration.json");\n' +
  '      HttpsURLConnection conn = (HttpsURLConnection)url.openConnection();\n' +
  '      conn.setRequestProperty("Authorization", "Basic " + encoded);\n' +
  '      conn.setRequestMethod("GET");\n' +
  '\n' +
  '      // Add your business logic below; response code can be obtained from \'conn.getResponseCode()\' and input stream from \'conn.getInputStream()\'\n' +
  '      ...\n' +
  '  }\n' +
  '}';

const accountGetInput = 'samplecode::sms[httpMethod="GET",urlSuffix="Accounts/#(account_sid)/SMS/Messages.json"]';
const accountPostInput = 'samplecode::sms[httpMethod="POST",urlSuffix="Accounts/#(account_sid)/SMS/Messages.json",bodyParameters="From=19876543212&To=13216549878&Body=Test SMS from Restcomm&StatusCallback=http://status.callback.url"]';
const accountPutInput = 'samplecode::accounts[httpMethod="PUT",urlSuffix="Accounts/#(account_sid).xml",bodyParameters="Password=NewPassword"]';
const multivarGetInput = 'samplecode::[httpMethod="GET",urlSuffix="Accounts/#(account_sid)/SMS/Messages/#(message_sid).json"]';
const novarGetInput = 'samplecode::[httpMethod="GET",urlSuffix="ExtensionsConfiguration.json"]';

function htmlEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

describe('Asciidoctor Registration', () => {
  it('should register the extension', () => {
    const registry = asciidoctor.Extensions.create();
    expect(registry['$block_macros?']()).to.be.false();
    asciidoctorCodeSamples.register(registry);
    expect(registry['$block_macros?']()).to.be.true();
  })
});

describe('Asciidoctor Conversion', () => {
  describe('Block macro', () => {
    describe('When extension is not registered', () => {
      it('should not convert a sample code macro to actual sample code', () => {
        // important: we 're escaping the input before we pass it to asciidoctor because asciidoctor does some html encoding which messes up the conversion
        const input = htmlEscape(accountPostInput);
        const html = asciidoctor.convert(input);
        expect(html).to.contain(input);
      })
    });
    describe('When extension is registered', () => {
      it('Should convert to sample code for account-related HTTP GET', () => {
        const input = accountGetInput;
        const registry = asciidoctor.Extensions.create();
        asciidoctorCodeSamples.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry });
        console.debug(html);
        expect(html).to.contain(expectedOutputCurlGet);
        expect(html).to.contain(expectedOutputNodeGet);
        expect(html).to.contain(expectedOutputPythonGet);
        expect(html).to.contain(expectedOutputJavaGet);
      });
      it('Should convert to sample code for account-related HTTP POST', () => {
        const input = accountPostInput;
        const registry = asciidoctor.Extensions.create();
        asciidoctorCodeSamples.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry });
        console.debug(html);
        expect(html).to.contain(expectedOutputCurlPost);
        expect(html).to.contain(expectedOutputNodePost);
        expect(html).to.contain(expectedOutputPythonPost);
        expect(html).to.contain(expectedOutputJavaPost);
      })
      it('Should convert to sample code for account-related HTTP PUT', () => {
        const input = accountPutInput;
        const registry = asciidoctor.Extensions.create();
        asciidoctorCodeSamples.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry });
        console.debug(html);
        expect(html).to.contain(expectedOutputCurlPut);
        expect(html).to.contain(expectedOutputNodePut);
        expect(html).to.contain(expectedOutputPythonPut);
        expect(html).to.contain(expectedOutputJavaPut);
      })
      it('Should convert to sample code for non account-related HTTP GET', () => {
        const input = multivarGetInput;
        const registry = asciidoctor.Extensions.create();
        asciidoctorCodeSamples.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry });
        console.debug(html);
        expect(html).to.contain(expectedOutputCurlGetMultivar);
        expect(html).to.contain(expectedOutputNodeGetMultivar);
        expect(html).to.contain(expectedOutputPythonGetMultivar);
        expect(html).to.contain(expectedOutputJavaGetMultivar);
      })
      it('Should convert to sample code for path with no variables', () => {
        const input = novarGetInput;
        const registry = asciidoctor.Extensions.create();
        asciidoctorCodeSamples.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry });
        console.debug(html);
        expect(html).to.contain(expectedOutputCurlGetNovar);
        expect(html).to.contain(expectedOutputNodeGetNovar);
        expect(html).to.contain(expectedOutputPythonGetNovar);
        expect(html).to.contain(expectedOutputJavaGetNovar);
      })

    });
  })
});
