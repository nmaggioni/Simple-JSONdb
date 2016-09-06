var semver = require('semver');
var nodeVersion = semver.clean(process.version);

if (semver.satisfies(nodeVersion, '>=6.0')) {
  module.exports = require('./jsondb.js');  // ES6
} else {
  module.exports = require('./dist/jsondb.js');  // ES5 (Babel transpiled)
}

