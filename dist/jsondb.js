'use strict';

var fs = require("fs");

/**
 * Default configuration values.
 * @type {{asyncWrite: boolean, syncOnWrite: boolean}}
 */
var defaultOptions = {
  asyncWrite: false,
  syncOnWrite: true
};

/**
 * Validates the contents of a JSON file.
 * @param {string} fileContent
 * @returns {boolean} True if content is ok, throws error if not.
 */
var validateJSON = function validateJSON(fileContent) {
  try {
    JSON.parse(fileContent);
  } catch (e) {
    throw new Error('Given filePath is not empty and its content is not valid JSON.');
  }
  return true;
};

/**
 * Main constructor, manages exhisting storage file and parses options against default ones.
 * @param {string} filePath The path of the file to use as storage.
 * @param {object} [options] Configuration options.
 * @param {number} [options.asyncWrite] Enables the storage to be asynchronously written to disk. Disabled by default (synchronous behaviour).
 * @param {boolean} [options.syncOnWrite] Makes the storage be written to disk after every modification. Enabled by default.
 * @constructor
 */
function JSONdb(filePath, options) {
  // Mandatory arguments check
  if (!filePath.length) {
    throw new Error('Missing filePath argument.');
  } else {
    this.filePath = filePath;
  }

  // Options parsing
  if (options) {
    for (var key in defaultOptions) {
      if (!options.hasOwnProperty(key)) options[key] = defaultOptions[key];
    }
    this.options = options;
  } else {
    this.options = defaultOptions;
  }

  // Storage initialization
  this.storage = {};

  // File exhistence check
  var stats = void 0;
  try {
    stats = fs.statSync(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      /* File doesn't exhist */
      return;
    } else {
      // Other error
      throw err; // TODO: Check perm
    }
  }
  /* File exhists */
  try {
    fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
  } catch (err) {
    throw new Error('Cannot read & write on path "' + filePath + '"');
  }
  if (stats.size > 0) {
    var data = void 0;
    try {
      data = fs.readFileSync(filePath);
    } catch (err) {
      throw err; // TODO: Do something meaningful
    }
    if (validateJSON(data)) this.storage = JSON.parse(data);
  }
}

/**
 * Creates or modifies a key in the database.
 * @param {string} key The key to create or alter.
 * @param {object} value Whatever to store in the key. You name it, just keep it JSON-friendly.
 */
JSONdb.prototype.set = function (key, value) {
  this.storage[key] = value;
  if (this.options.syncOnWrite) this.sync();
};

/**
 * Extracts the value of a key from the database.
 * @param {string} key The key to search for.
 * @returns {object|null} The value of the key or `null` if it doesn't exhist.
 */
JSONdb.prototype.get = function (key) {
  return this.storage.hasOwnProperty(key) ? this.storage[key] : undefined;
};

/**
 * Writes the local storage object to disk.
 */
JSONdb.prototype.sync = function () {
  if (this.options.asyncWrite) {
    fs.writeFile(this.filePath, JSON.stringify(this.storage, null, 4), function (err) {
      if (err) throw err;
    });
  } else {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.storage, null, 4));
    } catch (err) {
      throw err; // TODO: Do something meaningful
    }
  }
};

module.exports = JSONdb;
