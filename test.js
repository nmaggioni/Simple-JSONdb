var JSONdb = require('.');
var assert = require('chai').assert;
var fs = require('fs');

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
(function genFilePath() {
  while (true) {
    try {
      global.filePath = genFileName();
      fs.statSync(global.filePath);
    } catch (err) {
      break;
    }
  }
})();

/**
 * Returns a new instance of JSONdb.
 * @returns {JSONdb}
 */
function createInstance() {
  return new JSONdb(global.filePath);
}

describe('Privilege', function() {
  it('Tests are not being run as root', function() {
    var isRoot = process.getuid && process.getuid() === 0;
    //assert.isFalse(isRoot, 'Please do not run tests with root privileges!');
    if (isRoot) {
      assert.fail(false, isRoot, 'Please do not run tests with root privileges!');
    }
  });
});

describe('Consistency', function() {
  beforeEach('Database cleanup', function() {
    createInstance().deleteAll();
  });

  it('Create a new JSONdb instance and test `instanceOf`', function() {
    var db = createInstance();
    assert.instanceOf(db, JSONdb);
  });

  it('Check error handling for paths with no access', function() {
    assert.throws(function() {
      var db = new JSONdb('/' + Date.now().toString() + '.json', { syncOnWrite: true });
      db.set('foo', 'bar');
    });
  });

  it('Check that a non-exhistent key returns `undefined`', function() {
    var db = createInstance();
    assert.typeOf(db.get(Date.now()), 'undefined', 'Unexpected type of initial read');
  });
});

describe('Mechanics', function() {
  beforeEach('Database cleanup', function() {
    createInstance().deleteAll();
  });

  it('Check that values can change', function() {
    var db = createInstance();
    var change = { testVal: db.get('foo') };
    var changeFn = function() {
      db.set('foo', Date.now());
      change.testVal = db.get('foo');
    };
    assert.changes(changeFn, change, 'testVal', 'Values do not change');
  });

  it('Check that values can change (deterministic)', function() {
    var db = createInstance();
    db.set('foo', new Date().toISOString());
    var firstVal = db.get('foo');
    db.set('foo', new Date().toUTCString());
    var secondVal = db.get('foo');
    assert.notEqual(firstVal, secondVal, 'Values do not change');
  });

  it('Check that keys can be deleted', function() {
    var db = createInstance();
    db.set('foo', Date.now());
    var firstVal = db.get('foo');
    db.delete('foo');
    var secondVal = db.get('foo');
    assert.notEqual(firstVal, secondVal, 'Values do not change');
    assert.isUndefined(secondVal, 'Key was not deleted');
  });

  it('Check that keys existence can be verified (existent key)', function() {
    var db = createInstance();
    db.set('foo', Date.now());
    assert.isTrue(db.has('foo'), 'Key existence is erroneous');
  });

  it('Check that keys existence can be verified (non-existent key)', function() {
    var db = createInstance();
    assert.isFalse(db.has('foo'), 'Key existence is erroneous');
  });

  it('Verify sync to disk', function() {
    var db = createInstance();
    db.set('foo', Date.now());
    assert.doesNotThrow(db.sync, Error, 'Cannot save to disk');
  });
});

describe('Persistency', function() {
  var db = createInstance();
  db.set('foo', Date.now());
  var oldVal = db.get('foo');
  db = createInstance();
  assert.equal(db.get('foo'), oldVal, 'Reloaded value differs from last written');
});

describe('Cleanup', function() {
  it('Temporary file removal', function() {
    assert.doesNotThrow(function() {
      fs.unlinkSync(global.filePath);
    }, Error, 'Unable to cleanup');
  })
});
