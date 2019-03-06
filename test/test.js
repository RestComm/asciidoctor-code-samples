const chai = require('chai');
const expect = chai.expect;
const dirtyChai = require('dirty-chai');

chai.use(dirtyChai);

const asciidoctorCodeSamples = require('../src/asciidoctor-code-samples');
const asciidoctor = require('asciidoctor.js')();

// Expected results for GET methods
const expectedOutputCurlGet = 'curl -X GET https://cloud.restcomm.com/restcomm/2012-04-24/Accounts/YourAccountSid/SMS/Messages.json \\\n' +
  '   -u "YourAccountSid:YourAuthToken"';
const expectedOutputNodeGet = 'const request = require(\'request\');\n' +
  '\n' +
  'const restcommDomain = \'mycompany.restcomm.com\';\n' +
  'const accountSid = \'YourAccountSid\';\n' +
  'const authToken = \'YourAuthToken\';\n' +
  '\n' +
  'request({\n' +
  '      method: \'GET\',\n' +
  '      url: \'https://\' + restcommDomain + \'/restcomm/2012-04-24/Accounts/\' + accountSid + \'/SMS/Messages.json\',\n' +
  '      auth: { \'user\': accountSid, \'pass\': authToken },\n' +
  '   },\n' +
  '   function (error, response, body) {\n' +
  '      console.log("Status code: " + response.statusCode + "\\nBody: " + body);\n' +
  '   }\n' +
  ');';
const expectedOutputPythonGet = 'from http.client import HTTPSConnection\n' +
  'from base64 import b64encode\n' +
  '\n' +
  '# Change \'mycompany\' to the desired restcomm organization\n' +
  'restcomm_domain = \'mycompany.restcomm.com\'\n' +
  '# Provide your Account Sid and Auth Token from your Console Account page\n' +
  'account_sid = \'YourAccountSid\'\n' +
  'auth_token = \'YourAuthToken\'\n' +
  '\n' +
  'userAndPass = b64encode(bytes(account_sid + \':\' + auth_token, \'utf-8\')).decode("ascii")\n' +
  'headers = { \'Authorization\' : \'Basic %s\' %  userAndPass }\n' +
  '\n' +
  'conn = HTTPSConnection(restcomm_domain)\n' +
  'conn.request("GET", \'/restcomm/2012-04-24/Accounts/\' + account_sid + \'/SMS/Messages.json\',\n' +
  '      headers=headers)\n' +
  'res = conn.getresponse()\n' +
  '\n' +
  'print(res.status, res.reason)\n' +
  '\n' +
  '# Response text\n' +
  'data = res.read()\n' +
  '\n' +
  'conn.close()';
const expectedOutputJavaGet = 'import java.net.URL;\n' +
  'import javax.net.ssl.HttpsURLConnection;\n' +
  'import java.io.*;\n' +
  'import java.util.Base64;\n' +
  '\n' +
  'public class JavaSampleClass {\n' +
  '   // Change \'mycompany\' to the desired restcomm organization\n' +
  '   public static final String restcommDomain = "mycompany.restcomm.com";\n' +
  '   // Provide your Account Sid and Auth Token from your Console Account page\n' +
  '   public static final String accountSid = "YourAccountSid";\n' +
  '   public static final String authToken = "YourAuthToken";\n' +
  '\n' +
  '   public static void main(String[] args) throws Exception {\n' +
  '      String userAndPass = accountSid + \':\' + authToken;\n' +
  '      String encoded = Base64.getEncoder().encodeToString(userAndPass.getBytes());\n' +
  '\n' +
  '      URL url = new URL("https://" + restcommDomain + "/restcomm/2012-04-24/Accounts/" + accountSid + "/SMS/Messages.json");\n' +
  '      HttpsURLConnection conn = (HttpsURLConnection)url.openConnection();\n' +
  '      conn.setRequestProperty("Authorization", "Basic " + encoded);\n' +
  '      conn.setRequestMethod("GET");\n' +
  '\n' +
  '      BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));\n' +
  '      String inputLine;\n' +
  '      while ((inputLine = in.readLine()) != null)\n' +
  '         System.out.println(inputLine);\n' +
  '      in.close();\n' +
  '  }\n' +
  '}';

// Expected results for POST methods
const expectedOutputCurlPost = 'curl -X POST https://cloud.restcomm.com/restcomm/2012-04-24/Accounts/YourAccountSid/SMS/Messages.json \\\n' +
  '   -d \'From=19876543212\' \\\n' +
  '   -d \'To=13216549878\' \\\n' +
  '   -d \'Body=Test SMS from Restcomm\' \\\n' +
  '   -d \'StatusCallback=http://status.callback.url\' \\\n' +
  '   -u \'YourAccountSid:YourAuthToken\''
const expectedOutputNodePost = 'const request = require(\'request\');\n' +
  '\n' +
  'const restcommDomain = \'mycompany.restcomm.com\';\n' +
  'const accountSid = \'YourAccountSid\';\n' +
  'const authToken = \'YourAuthToken\';\n' +
  '\n' +
  'request.({\n' +
  '      method: \'POST\',\n' +
  '      url: \'https://\' + restcommDomain + \'/restcomm/2012-04-24/Accounts/\' + accountSid + \'/SMS/Messages.json\',\n' +
  '      auth: { \'user\': accountSid, \'pass\': authToken },\n' +
  '      form: {\n' +
  '         \'From\': \'19876543212\',\n' +
  '         \'To\': \'13216549878\',\n' +
  '         \'Body\': \'Test SMS from Restcomm\',\n' +
  '         \'StatusCallback\': \'http://status.callback.url\'\n' +
  '      }\n' +
  '   },\n' +
  '   function (error, response, body) {\n' +
  '      console.log("Status code: " + response.statusCode + "\\nBody: " + body);\n' +
  '});';
const expectedOutputPythonPost = 'from http.client import HTTPSConnection\n' +
  'from base64 import b64encode\n' +
  'from urllib.parse import urlencode\n' +
  '\n' +
  '# Change \'mycompany\' to the desired restcomm organization\n' +
  'restcomm_domain = \'mycompany.restcomm.com\'\n' +
  '# Provide your Account Sid and Auth Token from your Console Account page\n' +
  'account_sid = \'YourAccountSid\'\n' +
  'auth_token = \'YourAuthToken\'\n' +
  '\n' +
  'userAndPass = b64encode(bytes(account_sid + \':\' + auth_token, \'utf-8\')).decode("ascii")\n' +
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
  'conn = HTTPSConnection(restcomm_domain)\n' +
  'conn.request("POST", \'/restcomm/2012-04-24/Accounts/\' + account_sid + \'/SMS/Messages.json\',\n' +
  '      params, headers=headers)\n' +
  'res = conn.getresponse()\n' +
  '\n' +
  'print(res.status, res.reason)\n' +
  '\n' +
  '# Response text\n' +
  'data = res.read()\n' +
  '\n' +
  'conn.close()';
const expectedOutputJavaPost = 'import java.net.URL;\n' +
  'import javax.net.ssl.HttpsURLConnection;\n' +
  'import java.io.*;\n' +
  'import java.util.Base64;\n' +
  '\n' +
  'public class JavaSampleClass {\n' +
  '   // Change \'mycompany\' to the desired restcomm organization\n' +
  '   public static final String restcommDomain = "mycompany.restcomm.com";\n' +
  '   // Provide your Account Sid and Auth Token from your Console Account page\n' +
  '   public static final String accountSid = "YourAccountSid";\n' +
  '   public static final String authToken = "YourAuthToken";\n' +
  '\n' +
  '   public static void main(String[] args) throws Exception {\n' +
  '      String userAndPass = accountSid + \':\' + authToken;\n' +
  '      String encoded = Base64.getEncoder().encodeToString(userAndPass.getBytes());\n' +
  '\n' +
  '      URL url = new URL(("https://" + restcommDomain + "/restcomm/2012-04-24/Accounts/" + accountSid + "/SMS/Messages.json");\n' +
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
  '      BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));\n' +
  '      String inputLine;\n' +
  '      while ((inputLine = in.readLine()) != null)\n' +
  '         System.out.println(inputLine);\n' +
  '      in.close();\n' +
  '  }\n' +
  '}';

const getInput = 'samplecode::sms[httpMethod="GET",urlSuffix="Accounts/#(account_sid)/SMS/Messages.json"]';
const postInput = 'samplecode::sms[httpMethod="POST",urlSuffix="Accounts/#(account_sid)/SMS/Messages.json",postParameters="From=19876543212&To=13216549878&Body=Test SMS from Restcomm&StatusCallback=http://status.callback.url"]';

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
        const input = htmlEscape(postInput);
        const html = asciidoctor.convert(input);
        expect(html).to.contain(input);
      })
    });
    describe('When extension is registered', () => {
      it('Should convert to sample code for HTTP GET', () => {
        const input = getInput;
        const registry = asciidoctor.Extensions.create();
        asciidoctorCodeSamples.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry });
        console.debug(html);
        expect(html).to.contain(expectedOutputCurlGet);
        expect(html).to.contain(expectedOutputNodeGet);
        expect(html).to.contain(expectedOutputPythonGet);
        expect(html).to.contain(expectedOutputJavaGet);
      });
      it('Should convert to sample code for HTTP POST', () => {
        const input = postInput;
        const registry = asciidoctor.Extensions.create();
        asciidoctorCodeSamples.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry });
        //console.debug(html);
        expect(html).to.contain(expectedOutputCurlPost);
        expect(html).to.contain(expectedOutputNodePost);
        expect(html).to.contain(expectedOutputPythonPost);
        expect(html).to.contain(expectedOutputJavaPost);
      })
    });
  })
});
