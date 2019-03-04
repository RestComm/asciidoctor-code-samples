# asciidoctor-code-samples

Asciidoctor extension that allows to easily add tabbed code samples in various languages for API documentation written in Asciidoctor (including Antora). The extension exposes a new block macro that allows usages like the following:

* Asciidoctor code for HTTP GET API example:
```
samplecode::sms[httpMethod="GET",urlSuffix="Accounts/YourAccountSid/SMS/Messages.json"]
```

And here's the HTML result:

![HTTP GET Example](/doc/images/GET-example.png)

* Asciidoctor code for HTTP POST API example:

```
samplecode::sms[httpMethod="GET",urlSuffix="Accounts/YourAccountSid/SMS/Messages.json?From=19876543212&To=13216549878&StartTime=2018-05-30&EndTime=2018-06-09&Page=0&PageSize=10&SortBy=DateCreated:asc"]
```


![HTTP POST Example](/doc/images/POST-example.png)

## Quick start

TODO: Add instructions how to use it. Remember to add some notes on:
* Supported languages out of the box
* How templates work
* ...
