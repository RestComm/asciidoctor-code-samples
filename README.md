# asciidoctor-code-samples

[Asciidoctor.js](https://asciidoctor.org/docs/asciidoctor.js/) extension that allows to easily add tabbed source code samples in various programming languages for API documentation written in Asciidoctor (this means it also works with [Antora](https://antora.org/)). The extension exposes a new block macro that allows usages like the following:

##### 1. Asciidoctor code for HTTP GET API example:

```
samplecode::sms[httpMethod="GET",urlSuffix="Accounts/#(account_sid)/SMS/Messages.json"]
```

Rendered HTML:

![HTTP GET Example](/doc/images/GET-example.png)

##### 2. Asciidoctor code for HTTP POST API example:

```
samplecode::sms[httpMethod="POST",urlSuffix="Accounts/#(account_sid)/SMS/Messages.json",bodyParameters="From=19876543212&To=13216549878&Body=Test SMS from Restcomm&StatusCallback=http://status.callback.url"]
```

Rendered HTML:

![HTTP POST Example](/doc/images/POST-example.png)

## Quick start

TODO:

## Use from Antora

TODO:  

## How to extend the extension to handle more languages

Say for example that you want to support ruby additionally. What you need to do is:
* Create `ruby-template.txt` for GET requests and `nodejs-template-post` for POST requests in src/resources/lang-templates/
* Add normalization logic for the new language in `asciidoctor-code-samples.js:generateSample()`, before template is 'compiled' from es6-template-strings
* Add interpolation logic for the new language in `asciidoctor-code-samples.js:generateSample()` after template is 'compiled' so that any replacements are made before we have additional interpolation
* Add nodejs generated HTML in asciidoctor-code-samples.js:generateSamplesDiv()
* Add test cases to check both GET and POST conversion scenarios in `test/test/js`
