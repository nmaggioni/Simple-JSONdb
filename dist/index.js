'use strict';

var nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);

if (nodeVersion >= 6.2) {
  module.exports = require('./jsondb.js'); // ES6
} else {
  module.exports = require('./dist/jsondb.js'); // ES5 (Babel transpiled)
}
