var JSONdb = require('./jsondb');
var assert = require('chai').assert;
var fs = require('fs');

/**
 * Generates a file path and name based on current UNIX timestamp.
 * @returns {string}
 */
function genFilePath() {
  return '/tmp/' + Date.now().toString() + '.json';
}

// Make sure that the filePath does not exhist before starting.
var filePath;
while (true) {
  try {
    filePath = genFilePath();
    fs.statSync(filePath);
  } catch (err) {
    break;
  }
}

// Create a new JSONdb instance and test consistency.
var db = new JSONdb(filePath);
assert.instanceOf(db, JSONdb);

// Check that a non-exhistent key returns `undefined`.
assert.typeOf(db.get('foo'), 'undefined', 'Unexpected type of initial read');

// Check that values can change.
var change = { testVal: db.get('foo') };
var changeFn = function() {
  db.set('foo', new Date().toISOString());
  change.testVal = db.get('foo');
};
assert.changes(changeFn, change, 'testVal', 'Values do not change');

// Check that values can change (deterministic check).
db.set('foo', new Date().toISOString());
var firstVal = db.get('foo');
db.set('foo', new Date().toUTCString());
var secondVal = db.get('foo');
assert.notEqual(firstVal, secondVal, 'Values do not change');

// Make sure that everything is written to disk.
db.sync();

// Create new instance of JSONdb to replace the old one.
db = new JSONdb(filePath);

// Check that the last written value has persisted to disk and has been read successfully on reload.
assert.equal(db.get('foo'), secondVal, 'Persistence test failed');

// Cleanup.
fs.unlinkSync(filePath);
