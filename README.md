# asciidoctor-code-samples

Asciidoctor extension that allows to easily add tabbed code samples in various languages for API documentation written in Asciidoctor (including Antora). The extension exposes a new block macro that allows usages like the following:

* Asciidoctor code for HTTP GET API example:

```
samplecode::sms[httpMethod="GET",urlSuffix="Accounts/#(account_sid)/SMS/Messages.json"]
```

HTML result:

![HTTP GET Example](/doc/images/GET-example.png)

* Asciidoctor code for HTTP POST API example:

```
samplecode::sms[httpMethod="POST",urlSuffix="Accounts/#(account_sid)/SMS/Messages.json",postParameters="From=19876543212&To=13216549878&Body=Test SMS from Restcomm&StatusCallback=http://status.callback.url"]
```

HTML result:

![HTTP POST Example](/doc/images/POST-example.png)

## Quick start

TODO:

## How to extend the extension to handle more languages

Say for example that you want to support ruby additionally. What you need to do is:
* Create `ruby-template.txt` for GET requests and `nodejs-template-post` for POST requests in src/resources/lang-templates/
* Add normalization logic for the new language in `asciidoctor-code-samples.js:generateSample()`, before template is 'compiled' from es6-template-strings
* Add interpolation logic for the new language in `asciidoctor-code-samples.js:generateSample()` after template is 'compiled' so that any replacements are made before we have additional interpolation
* Add nodejs generated HTML in asciidoctor-code-samples.js:generateSamplesDiv()
* Add test cases to check both GET and POST conversion scenarios in `test/test/js`
