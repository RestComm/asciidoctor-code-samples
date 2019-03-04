/**
 * @author: Antonis Tsakiridis
 */

const fs = require('fs')
const template = require('es6-template-strings')

// We will be hosting multiple sample code sections in every API page, so let's increment a global index so that
// each sample section has unique css classes and ids and the js code for tab manipulation doesn't break.
let sampleCodeSectionIndex = 1;
let currentFile = ''

function generateSample(attrs, templateFile, language, dataLanguage) {
  // Fix the request parameters for POST methods because they are using the java format. We need to adjust for the rest of the languages
  if (attrs.httpMethod === 'POST') {
    if (templateFile.includes("python")) {
      // Normalize from "From=19876543212&To=13216549878&..." to "'From': '19876543212', 'To': '13216549878', ..."
      const params = attrs.postParameters.split('&')
      attrs.normalizedPostParameters = params.map((keyValue) => {
        const split = keyValue.split('=')
        return `   '${split[0]}': '${split[1]}'`
      }).join(',\n')
    }
    else if (templateFile.includes("curl")) {
      // Normalize from "From=19876543212&To=13216549878&..." to "-d 'From=19876543212', 'To=13216549878', ..."
      attrs.normalizedPostParameters = attrs.postParameters.split('&')
        .map(keyValue => `   -d '${keyValue}'`)
        .join(" \\ \n")
    }
    else {
      // For Java Post parameters are already in normalized form, we just need to beautify a bit
      //attrs.normalizedPostParameters = attrs.postParameters
      attrs.normalizedPostParameters = attrs.postParameters.split('&')
        .map(keyValue => `${keyValue}&`)
        .join("\" + \n        \"")

      // remove last '&'
      if (attrs.normalizedPostParameters[attrs.normalizedPostParameters.length - 1] === '&') {
        attrs.normalizedPostParameters = attrs.normalizedPostParameters.slice(0, -1)
      }
    }
  }

  // Read template from file and evaluate it so that all variables get proper values
  const templateString = template(fs.readFileSync(__dirname + `/resources/lang-templates/${templateFile}.txt`, 'utf8'), { attrs: attrs });

  // Notice we are replacing 3 or more new lines with just 2 to account for huge empty spaces when some parameters are not populated
  return `<pre class="highlightjs highlight"><code class="${language} hljs" data-lang="${dataLanguage}">${templateString}</code></pre>`.replace(/(\r\n|\n|\r){3,}/gm, "$1$1");
}

const generateSamplesDiv = function(parent, attrs) {
  let divHtml = ''
  let templateSuffix = ''
  sampleCodeSectionIndex++

  if (attrs.httpMethod === 'POST') {
    templateSuffix = '-post'
  }

  // Avoid duplicating the same script over and over each time an .adoc has a sample code section. We 're only adding the script once per .adoc
  if (parent.document.reader.file !== currentFile) {
    currentFile = parent.document.reader.file
    divHtml =  `<script>
      function openLanguage(language, index) {
        const sampleClasses = document.getElementsByClassName("sample-language-" + index);
        for (const sampleClass of sampleClasses) {
          sampleClass.style.display = "none";
        }
        document.getElementById(language + '-' + index).style.display = "block";
      }
      </script>`
  }
  divHtml += `
      <!-- <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> -->

      <div class="w3-bar w3-black">
        <button class="w3-bar-item w3-button" onclick="openLanguage('Curl', ${sampleCodeSectionIndex})">Curl</button>
        <button class="w3-bar-item w3-button" onclick="openLanguage('Java', ${sampleCodeSectionIndex})">Java</button>
        <button class="w3-bar-item w3-button" onclick="openLanguage('Python', ${sampleCodeSectionIndex})">Python</button>
      </div>
      <div id="Curl-${sampleCodeSectionIndex}" class="sample-language-${sampleCodeSectionIndex}">
        ${generateSample(attrs, "curl-template" + templateSuffix, "language-console", "console")}
      </div>
      <div id="Java-${sampleCodeSectionIndex}" class="sample-language-${sampleCodeSectionIndex}" style="display:none">
        ${generateSample(attrs, "java-template" + templateSuffix, "language-java", "java")}
      </div>
      <div id="Python-${sampleCodeSectionIndex}" class="sample-language-${sampleCodeSectionIndex}" style="display:none">
        ${generateSample(attrs, "python-template" + templateSuffix, "language-python", "python")}
      </div>
      `;
  return divHtml;
}

const chartBlockMacro = function () {
  const self = this

  self.named('samplecode')
  this.positionalAttributes(['httpMethod', 'urlSuffix']);

  self.process(function (parent, target, attrs) {
    attrs = fromHash(attrs);

    const html = generateSamplesDiv(parent, attrs)
    return self.createBlock(parent, 'pass', html, attrs, {})
  })
}

module.exports.register = function register (registry) {
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.blockMacro(chartBlockMacro)
    })
  } else if (typeof registry.block === 'function') {
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
