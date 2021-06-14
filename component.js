
let component = module.exports = require('@webfocus/component')('util','Framework utilities like pagination and submit json.')
component.hidden = true;
component.staticApp.prototype = require('express').static(require('path').join(__dirname, 'cli'))