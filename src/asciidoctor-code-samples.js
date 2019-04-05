/**
 * @author: Antonis Tsakiridis
 */

const fs = require('fs')
const template = require('es6-template-strings')

// We will be hosting multiple sample code sections in every API page, so let's increment a global index so that
// each sample section has unique css classes and ids and the js code for tab manipulation doesn't break.
let sampleCodeSectionIndex = 1;
let currentFile = ''

function putOrPost(httpMethod) {
  return [ 'POST', 'PUT' ].some(value => value === httpMethod);
}

/**
 * Generate sample code for the given language, to be put into the generated html
 * @param attrs, the block macro parameters passed in the .adoc file, like httpMethod, urlSuffix, etc
 * @param templateFile, the language template file found in resources/lang-templates
 * @param language, the language for the sample code
 * @param dataLanguage, the name of the language that the highlighter uses to do proper highlighting
 * @returns {string}, the html chunk of the generated sample code, to be placed in the tabbed controls for sample code
 */
function generateSample(attrs, templateFile, language, dataLanguage) {
  // Normalization logic: Fix the request parameters for POST methods because they are using the java format. We need to adjust for the rest of the languages
  if (templateFile.includes("python")) {
    // Normalize from "From=19876543212&To=13216549878&..." to "'From': '19876543212', 'To': '13216549878', ..."
    if (putOrPost(attrs.httpMethod)) {
      const params = attrs.bodyParameters.split('&')
      attrs.normalizedBodyParameters = params.map((keyValue) => {
        const split = keyValue.split('=')
        return `   '${split[0]}': '${split[1]}'`
      }).join(',\n')
    }
  } else if (templateFile.includes("curl")) {
    if (putOrPost(attrs.httpMethod)) {
      // Normalize from "From=19876543212&To=13216549878&..." to "-d 'From=19876543212', 'To=13216549878', ..."
      attrs.normalizedBodyParameters = attrs.bodyParameters.split('&')
        .map(keyValue => `   -d '${keyValue}'`)
        .join(" \\ \n")
    }
  } else if (templateFile.includes("node")) {
    if (putOrPost(attrs.httpMethod)) {
      // Normalize from "From=19876543212&To=13216549878&..." to "'From': '19876543212', 'To': '13216549878', ..."
      const params = attrs.bodyParameters.split('&')
      attrs.normalizedBodyParameters = params.map((keyValue) => {
        const split = keyValue.split('=')
        return `         '${split[0]}': '${split[1]}'`
      }).join(',\n')
    }
  } else {
    if (putOrPost(attrs.httpMethod)) {
      // For Java Post parameters are already in normalized form, we just need to beautify a bit
      attrs.normalizedBodyParameters = attrs.bodyParameters.split('&')
        .map(keyValue => `${keyValue}&`)
        .join("\" + \n        \"")

      // remove last '&'
      if (attrs.normalizedBodyParameters[attrs.normalizedBodyParameters.length - 1] === '&') {
        attrs.normalizedBodyParameters = attrs.normalizedBodyParameters.slice(0, -1)
      }
    }
  }

  if (language !== 'language-console') {
    // For curl/console additionalParameters section is not applicable
    let actualMatches = []
    const matches = attrs.urlSuffix.match(/#\(\w+?\)/g)
    if (matches) {
      matches.forEach(match => {
        if (!match.includes('account_sid')) {
          actualMatches.push({match: match, language: language})
        }
      })

      if (actualMatches.length > 0) {
        let spaces = ''
        if (language === 'language-java')
          spaces = '   '

        // parse all parameters from urlSuffix, which is in the form 'Accounts/#(account_sid)/SMS/Messages/#(message_sid).json'
        // and generate additionalParameters section. Notice that we keep accound_sid out because it's already in the template
        // since it's used always for authentication
        attrs.additionalParameters = actualMatches
          .map(element => {
            const parsed = element.match.match(/^#\((\w*)\)$/)[1];
            if (element.language === 'language-javascript')
              return 'const ' + parsed.toUpperCase() + ' = \'my_' + parsed.toUpperCase() + '\'';
            else if (element.language === 'language-python')
              return parsed.toUpperCase() + ' = \'my_' + parsed.toUpperCase() + '\'';
            else if (element.language === 'language-java')
              return 'public static final String ' + parsed.toUpperCase() + ' = "my_' + parsed.toUpperCase() + '"';
          })
          .reduce((accumulator, current) => {
            return accumulator + '\n' + spaces + current;
          }, '// Provide additional path parameters if applicable');
      }
    }
  }

  // Read template from file and evaluate it so that all variables get proper values
  const templateString = template(fs.readFileSync(__dirname + `/resources/lang-templates/${templateFile}.txt`, 'utf8'), { attrs: attrs });

  // Interpolation logic: Each language concatenates strings using different syntax, so let's interpolate differently depending on lang
  const templateStringInterpolated = templateString.replace(/#\((\w+?)\)/g, function(match, p1) {
    if (templateFile.includes("python"))
      return '\' + ' + p1.toUpperCase() + ' + \''
    else if (templateFile.includes("curl"))
      return p1.toUpperCase()
    else if (templateFile.includes("node"))
      return '\' + ' + p1.toUpperCase() + ' + \''
    else // Java
      return '" + ' + p1.toUpperCase() + ' + "'
  })

  // Notice we are replacing 3 or more new lines with just 2 to account for huge empty spaces when some parameters are not populated
  return `<pre class="highlightjs highlight"><code class="${language} hljs" data-lang="${dataLanguage}">${templateStringInterpolated}</code></pre>`.replace(/(\r\n|\n|\r){3,}/gm, "$1$1");
}

const generateSamplesDiv = function(parent, attrs) {
  let divHtml = ''
  let templateSuffix = ''
  sampleCodeSectionIndex++

  if (putOrPost(attrs.httpMethod)) {
    // we're using the same template for both post and put, suffixed with '-post'
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
        
        // first, disable the previously selected tab title
        const previouslyActive = document.getElementsByClassName('scsIndex-' + index + ' is-active')
        if (previouslyActive.length > 0) {
          previouslyActive[0].classList.toggle('is-active')
        }

        // then, enable the newly selected title
        event.target.classList.toggle('is-active')
      }
      </script>`
  }
  divHtml += `
      <div class="sample-code-bar">
        <button class="sample-code-button scsIndex-${sampleCodeSectionIndex} is-active" onclick="openLanguage('Curl', ${sampleCodeSectionIndex})">Curl</button>
        <button class="sample-code-button scsIndex-${sampleCodeSectionIndex}" onclick="openLanguage('Nodejs', ${sampleCodeSectionIndex})">Nodejs</button>
        <button class="sample-code-button scsIndex-${sampleCodeSectionIndex}" onclick="openLanguage('Python', ${sampleCodeSectionIndex})">Python</button>
        <button class="sample-code-button scsIndex-${sampleCodeSectionIndex}" onclick="openLanguage('Java', ${sampleCodeSectionIndex})">Java</button>
      </div>
      <div id="Curl-${sampleCodeSectionIndex}" class="sample-language-${sampleCodeSectionIndex}">
        ${generateSample(attrs, "curl-template" + templateSuffix, "language-console", "console")}
      </div>
      <div id="Nodejs-${sampleCodeSectionIndex}" class="sample-language-${sampleCodeSectionIndex}" style="display:none">
        ${generateSample(attrs, "nodejs-template" + templateSuffix, "language-javascript", "javascript")}
      </div>
      <div id="Python-${sampleCodeSectionIndex}" class="sample-language-${sampleCodeSectionIndex}" style="display:none">
        ${generateSample(attrs, "python-template" + templateSuffix, "language-python", "python")}
      </div>
      <div id="Java-${sampleCodeSectionIndex}" class="sample-language-${sampleCodeSectionIndex}" style="display:none">
        ${generateSample(attrs, "java-template" + templateSuffix, "language-java", "java")}
      </div>
      `;
  return divHtml;
}

const chartBlockMacro = function () {
  const self = this

  self.named('samplecode')
  this.positionalAttributes(['httpMethod', 'urlSuffix']);

  self.process(function (parent, target, attrs) {
    // If attrs have attribute named $$keys it means that a special Hash object is used, so we need
    // to covert to normal js Object. This currently happens when used from Antora. Otherwise we leave it
    // as is (like when invoked from Unit Tests
    if ('$$keys' in attrs) {
      attrs = fromHash(attrs);
    }

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
