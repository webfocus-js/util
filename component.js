
module.exports = require('@webfocus/component')('util','Framework utilities like pagination and submit json.')
module.exports.hidden = true;
module.exports.staticApp = require('express').static(require('path').join(__dirname, 'cli'))