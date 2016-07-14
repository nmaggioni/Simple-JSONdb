var JSONdb = require('./jsondb');
var assert = require('chai').assert;
var fs = require('fs');
var filePath = genFilePath();

/**
 * Generates a file path and name based on current UNIX timestamp.
 * @returns {string}
 */
function genFileName() {
  return '/tmp/' + Date.now().toString() + '.json';
}

/**
 * Makes sure that a unique filename is generated.
 */
function genFilePath() {
  while (true) {
    try {
      global.filePath = genFileName();
      fs.statSync(global.filePath);
    } catch (err) {
      break;
    }
  }
}

/**
 * Returns a new instance of JSONdb.
 * @returns {JSONdb}
 */
function createInstance() {
  return new JSONdb(global.filePath);
}

describe("Consistency", function() {
  it("Create a new JSONdb instance and test `instanceOf`", function() {
    var db = createInstance();
    assert.instanceOf(db, JSONdb);
  });

  it("Check that a non-exhistent key returns `undefined`", function() {
    var db = createInstance();
    assert.typeOf(db.get(Date.now()), 'undefined', 'Unexpected type of initial read');
  });
});

describe("Mechanics", function() {
  it("Check that values can change", function() {
    var db = createInstance();
    var change = { testVal: db.get('foo') };
    var changeFn = function() {
      db.set('foo', Date.now());
      change.testVal = db.get('foo');
    };
    assert.changes(changeFn, change, 'testVal', 'Values do not change');
  });

  it("Check that values can change (deterministic)", function() {
    var db = createInstance();
    db.set('foo', new Date().toISOString());
    var firstVal = db.get('foo');
    db.set('foo', new Date().toUTCString());
    var secondVal = db.get('foo');
    assert.notEqual(firstVal, secondVal, 'Values do not change');
  });

  it("Check that keys can be deleted", function() {
    var db = createInstance();
    db.set('foo', Date.now());
    var firstVal = db.get('foo');
    db.delete('foo');
    var secondVal = db.get('foo');
    assert.notEqual(firstVal, secondVal, 'Values do not change');
    assert.isUndefined(secondVal, 'Key was not deleted');
  });

  it("Verify sync to disk", function() {
    var db = createInstance();
    db.set('foo', Date.now());
    assert.doesNotThrow(db.sync, Error, 'Cannot save to disk');
  });
});

describe("Persistency", function() {
  var db = createInstance();
  db.set('foo', Date.now());
  var oldVal = db.get('foo');
  db = createInstance();
  assert.equal(db.get('foo'), oldVal, 'Reloaded value differs from last written');
});

describe("Cleanup", function() {
  it("Temporary file removal", function() {
    assert.doesNotThrow(function() { fs.unlinkSync(global.filePath); }, Error, 'Unable to cleanup');
  })
});
