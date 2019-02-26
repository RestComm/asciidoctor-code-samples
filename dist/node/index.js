const util = require('util')

function generateCurlSample(attrs) {
  // Notice we cannot indent this properly as it is a 'pre' block and any whitespaces will mess up the result
  return `
<div id="Curl" class="sample-language">
<pre class="highlightjs highlight"><code class="language-console hljs" data-lang="console">$ curl -X ${attrs.httpMethod} https://cloud.restcomm.com/restcomm/2012-04-24/Accounts/${attrs.urlSuffix}
${attrs.postParametersCurl}
-u &lt;accountSid&gt;:&lt;authToken&gt;</code></pre>
  </div>`
}

function generateJavaSample(attrs) {
  // Notice we cannot indent this properly as it is a 'pre' block and any whitespaces will mess up the result
  return `
<div id="Java" class="sample-language" style="display:none">
    <pre class="highlightjs highlight"><code class="language-java hljs" data-lang="java">import ...;

  public class Example {
    // Find your Account Sid and Token at Restcomm Console
    public static final String ACCOUNT_SID = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
    public static final String AUTH_TOKEN = "your_auth_token";

    public static void main(String[] args) {
  ...
    SMSMessage message = SMSMessage.creator(
    ${attrs.postParametersJava}
      .create();
  }
}</code></pre>
</div>`
}

function generatePythonSample(attrs) {
  // Notice we cannot indent this properly as it is a 'pre' block and any whitespaces will mess up the result
  return `
<div id="Python" class="sample-language" style="display:none">
<pre class="highlightjs highlight"><code class="language-python hljs" data-lang="python">import ...

# Your Account Sid and Auth Token from Restcomm Console
account_sid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
auth_token = 'your_auth_token'
client = Client(account_sid, auth_token)

message = client.messages.create(
                            ${attrs.postParametersPython}
                          )</code></pre>
</div>`
}

const generateSamplesDiv = function(attrs) {
  return lines =
     `<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">

      <div class="w3-bar w3-black">
        <button class="w3-bar-item w3-button" onclick="openLanguage('Curl')">Curl</button>
        <button class="w3-bar-item w3-button" onclick="openLanguage('Java')">Java</button>
        <button class="w3-bar-item w3-button" onclick="openLanguage('Python')">Python</button>
      </div>
        ${generateCurlSample(attrs)}
        ${generateJavaSample(attrs)}
        ${generatePythonSample(attrs)}
      <script>
        function openLanguage(cityName) {
          var i;
          var x = document.getElementsByClassName("sample-language");
          for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
          }
          document.getElementById(cityName).style.display = "block";
        }
      </script>`;
}

/*
const generateChart = function (data, labels, attrs) {
  return createDiv(data, labels, attrs)
}

const createDiv = function (data, labels, attrs) {
  const series = data.map((value, index) => `data-chart-series-${index}="${value.join(',')}"`)
  const title = attrs.title ? `<div class="title">${attrs.title}</div>\n` : ''
  const chartHeight = `data-chart-height="${getHeight(attrs)}" `
  const chartWidth = `data-chart-width="${getWidth(attrs)}" `
  const chartType = `data-chart-type="${getType(attrs)}" `
  const chartColors = 'data-chart-colors="#72B3CC,#8EB33B" '
  const chartLabels = `data-chart-labels="${labels.join(',')}" `
  return `<div class="openblock">${title}<div class="ct-chart" ${chartHeight}${chartWidth}${chartType}${chartColors}${chartLabels}${series.join(' ')}></div>
</div>`
}

const getHeight = function (attrs) {
  const height = attrs.height
  return typeof height === 'string' ? height : '400'
}

const getWidth = function (attrs) {
  const width = attrs.width
  return typeof width === 'string' ? width : '600'
}

const getType = function (attrs) {
  const type = attrs.type
  if (type === 'bar') {
    return 'Bar'
  } else if (type === 'line') {
    return 'Line'
  } else {
    // By default chart line
    return 'Line'
  }
}
*/

const chartBlockMacro = function () {
  const self = this

  self.named('samplecode')
  //self.positionalAttributes(['type', 'width', 'height'])
  this.positionalAttributes(['httpMethod', 'urlSuffix']);

  self.process(function (parent, target, attrs) {
    attrs = fromHash(attrs);

    //const filePath = parent.normalizeAssetPath(target, 'target')
    //const fileContent = parent.readAsset(filePath, { 'warn_on_failure': true, 'normalize': true })
    //if (typeof fileContent === 'string') {
      //const lines = fileContent.split('\n')
      //const labels = lines[0].split(',')
      //lines.shift()
      //const data = lines.map(line => line.split(','))
      //const html = generateChart(data, labels, attrs)
      const html = generateSamplesDiv(attrs)
      return self.createBlock(parent, 'pass', html, attrs, {})
    //}
    //return self.createBlock(parent, 'pass', `<div class="openblock">[file does not exist or cannot be read: ${target}]</div>`, attrs, {})
  })
}

/*
const chartBlock = function () {
  const self = this

  self.named('chart')
  self.positionalAttributes(['type', 'width', 'height'])
  self.$content_model('raw')
  self.onContext('literal')

  self.process(function (parent, reader, attrs) {
    const lines = reader.getLines()
    console.error("-- Parent: " + parent)
    console.error("-- Lines: " + lines)
    console.error("-- Attrs: " + attrs.line)
    if (lines && lines.length === 0) {
      return self.createBlock(parent, 'pass', '<div class="openblock">[chart is empty]</div>', attrs, {})
    }
    const labels = lines[0].split(',')
    lines.shift()
    const data = lines.map(line => line.split(','))
    const html = generateChart(data, labels, attrs)
    return self.createBlock(parent, 'pass', html, attrs, {})
  })
}
*/

module.exports.register = function register (registry) {
  if (typeof registry.register === 'function') {
    registry.register(function () {
      //this.block(chartBlock)
      this.blockMacro(chartBlockMacro)
    })
  } else if (typeof registry.block === 'function') {
    //registry.block(chartBlock)
    registry.blockMacro(chartBlockMacro)
  }
  return registry
}

const fromHash = function (hash) {
  let object = {};
  const data = hash.$$smap;
  for (let key in data) {
    object[key] = data[key];
  }
  return object;
};
