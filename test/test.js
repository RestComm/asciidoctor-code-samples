const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')

chai.use(dirtyChai)

const asciidoctorCodeSamples = require('../src/asciidoctor-code-samples')
const asciidoctor = require('asciidoctor.js')()

const getInput = 'samplecode::sms[httpMethod="GET",urlSuffix="Accounts/YourAccountSid/SMS/Messages.json"]'
const postInput = 'samplecode::sms[httpMethod="POST",urlSuffix="Accounts/YourAccountSid/SMS/Messages.json",postParameters="From=19876543212&To=client:alice&Body=Test SIP message from Restcomm&StatusCallback=http://status.callback.url"]'

const expectedOutputCurlGet = 'curl -X GET https://cloud.restcomm.com/restcomm/2012-04-24/Accounts/YourAccountSid/SMS/Messages.json \\\n' +
  '   -u "YourAccountSid:YourAuthToken"'
const expectedOutputJavaGet = 'import java.net.URL;\n' +
  'import javax.net.ssl.HttpsURLConnection;\n' +
  'import java.io.*;\n' +
  'import java.util.Base64;\n' +
  '\n' +
  'public class JavaSampleClass {\n' +
  '   public static void main(String[] args) throws Exception {\n' +
  '     // Provide your Account Sid and Auth Token that can be found in your Console Account page\n' +
  '     String userAndPass = "YourAccountSid:YourAuthToken";\n' +
  '     String encoded = Base64.getEncoder().encodeToString(userAndPass.getBytes());\n' +
  '\n' +
  '     // Change RestcommCloudDomain to your Restcomm Cloud Domain and YourAccountSid to your Account Sid\n' +
  '     URL url = new URL("https://RestcommCloudDomain/restcomm/2012-04-24/");\n' +
  '     HttpsURLConnection conn = (HttpsURLConnection)url.openConnection();\n' +
  '     conn.setRequestProperty("Authorization", "Basic " + encoded);\n' +
  '     conn.setRequestMethod("");\n' +
  '\n' +
  '     BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));\n' +
  '     String inputLine;\n' +
  '     while ((inputLine = in.readLine()) != null)\n' +
  '        System.out.println(inputLine);\n' +
  '     in.close();\n' +
  '  }\n' +
  '}'
const expectedOutputPythonGet = 'from http.client import HTTPSConnection\n' +
  'from base64 import b64encode\n' +
  '\n' +
  '# Provide your Account Sid and Auth Token that can be found in your Console Account page\n' +
  'userAndPass = b64encode(b"YourAccountSid:YourAuthToken").decode("ascii")\n' +
  'headers = { \'Authorization\' : \'Basic %s\' %  userAndPass }\n' +
  '\n' +
  '# Change \'RestcommCloudDomain\' to the domain of the Point of Presence you signed up on\n' +
  'conn = HTTPSConnection("RestcommCloudDomain")\n' +
  '# Update YourAccountSid with your Account Sid\n' +
  'conn.request("", \'/restcomm/2012-04-24/\', headers=headers)\n' +
  'res = conn.getresponse()\n' +
  '\n' +
  'print(res.status, res.reason)\n' +
  '\n' +
  '# Response text\n' +
  'data = res.read()\n' +
  '\n' +
  'conn.close()'

const expectedOutputCurlPost = ''
const expectedOutputJavaPost = ''
const expectedOutputPythonPost = ''

function htmlEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

describe('Registration', () => {
  it('should register the extension', () => {
    const registry = asciidoctor.Extensions.create()
    expect(registry['$block_macros?']()).to.be.false()
    asciidoctorCodeSamples.register(registry)
    expect(registry['$block_macros?']()).to.be.true()
  })
})

describe('Conversion', () => {
  describe('Block macro', () => {
    describe('When extension is not registered', () => {
      it('should not convert a sample code macro to actual sample code', () => {
        // important: we 're escaping the input before we pass it to asciidoctor because asciidoctor does some html encoding which messes up the conversion
        const input = htmlEscape(postInput)
        const html = asciidoctor.convert(input)
        expect(html).to.contain(input)
      })
    })
    describe('When extension is registered', () => {
      it('GET: should convert to sample code', () => {
        const input = 'samplecode::sms[httpMethod="GET",urlSuffix="Accounts/YourAccountSid/SMS/Messages.json"]'     // getInput
        const registry = asciidoctor.Extensions.create()
        asciidoctorCodeSamples.register(registry)
        const html = asciidoctor.convert(input, { extension_registry: registry })
        console.debug(html)
        expect(html).to.contain(expectedOutputCurlGet)
        expect(html).to.contain(expectedOutputJavaGet)
        expect(html).to.contain(expectedOutputPythonGet)
      });
      it('GET2: should convert to sample code', () => {
        const input = 'samplecode::sms[httpMethod="GET",urlSuffix="Accounts/#{account_sid}/SMS/Messages.json"]'     // getInput
        const registry = asciidoctor.Extensions.create()
        asciidoctorCodeSamples.register(registry)
        const html = asciidoctor.convert(input, { extension_registry: registry })
        console.debug(html)
        expect(html).to.contain(expectedOutputCurlGet)
        //expect(html).to.contain(expectedOutputJavaGet)
        //expect(html).to.contain(expectedOutputPythonGet)
      });
    })
    describe('When extension is registered', () => {
      it('POST: should convert to sample code', () => {
        const input = 'samplecode::sms[httpMethod="POST",urlSuffix="Accounts/#{account_sid}/SMS/Messages.json",postParameters="From=19876543212&To=13216549878&Body=Test SMS from Restcomm&StatusCallback=http://status.callback.url"]'
        const registry = asciidoctor.Extensions.create()
        asciidoctorCodeSamples.register(registry)
        const html = asciidoctor.convert(input, { extension_registry: registry })
        console.debug(html)
        //expect(html).to.contain(expectedOutputCurlPost)
        //expect(html).to.contain(expectedOutputJavaPost)
        //expect(html).to.contain(expectedOutputPythonPost)
      })
      it('should return an error message if the file does not exist', () => {
        const input = nonExistingChartBlockMacroInput()
        const registry = asciidoctor.Extensions.create()
        asciidoctorCodeSamples.register(registry)
        const html = asciidoctor.convert(input, { extension_registry: registry })
        expect(html).to.contain('[file does not exist or cannot be read: test/fixtures/404.csv]')
      })
    })
  })
})
