const JSONdb = require('.');
const assert = require('chai').assert;
const fs = require('fs');

const iterableTestsCount = 100;

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
    let isRoot = process.getuid && process.getuid() === 0;
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
    const db = createInstance();
    assert.instanceOf(db, JSONdb);
  });

  it('Check error handling for paths with no access', function() {
    assert.throws(function() {
      const db = new JSONdb('/' + Date.now().toString() + '.json', { syncOnWrite: true });
      db.set('foo', 'bar');
    });
  });

  it('Check that a non-exhistent key returns `undefined`', function() {
    const db = createInstance();
    assert.typeOf(db.get(Date.now()), 'undefined', 'Unexpected type of initial read');
  });
});

describe('Mechanics', function() {
  beforeEach('Database cleanup', function() {
    createInstance().deleteAll();
  });

  it('Check that values can change', function() {
    const db = createInstance();
    for (let i = 0; i < iterableTestsCount; i++) {
      let change = { testVal: db.get('foo') };
      let changeFn = function() {
        db.set('foo', Math.random());
        change.testVal = db.get('foo');
      };
      assert.changes(changeFn, change, 'testVal', 'Values do not change');
    }
  });

  it('Check that values can change (deterministic)', function() {
    const db = createInstance();
    for (let i = 0; i < iterableTestsCount; i++) {
      db.set('foo', new Date().toISOString());
      let firstVal = db.get('foo');
      db.set('foo', new Date().toUTCString());
      let secondVal = db.get('foo');
      assert.notEqual(firstVal, secondVal, 'Values do not change');
    }
  });

  it('Check that keys can be deleted', function() {
    const db = createInstance();
    for (let i = 0; i < iterableTestsCount; i++) {
      db.set('foo', Date.now());
      let firstVal = db.get('foo');
      db.delete('foo');
      let secondVal = db.get('foo');
      assert.notEqual(firstVal, secondVal, 'Values do not change');
      assert.isUndefined(secondVal, 'Key was not deleted');
    }
  });

  it('Check that keys existence can be verified', function() {
    const db = createInstance();
    for (let i = 0; i < iterableTestsCount; i++) {
      db.set('foo', Date.now());
      assert.isTrue(db.has('foo'), 'Key existence is erroneous (returned False instead of True)');
      db.delete('foo');
      assert.isFalse(db.has('foo'), 'Key existence is erroneous (returned True instead of False)');
    }
  });

  it('Verify sync to disk', function() {
    const db = createInstance();
    db.set('foo', Date.now());
    assert.doesNotThrow(db.sync, Error, 'Cannot save to disk');
  });

  it('Check that the copy of the underlying structure is coherent', function() {
    const db = createInstance();
    const reference = {};
    for (let i = 0; i < iterableTestsCount; i++) {
      const now = Date.now();
      db.set('foo', now);
      reference.foo = now;
      db.set('bar', now + 1000);
      reference.bar = now + 1000;
      assert.equal(JSON.stringify(db.JSON()), JSON.stringify(reference), 'Returned copy does not match');
    }
  });

  it('Check that the underlying structure can be replaced', function() {
    const db = createInstance();
    const replacement = {};
    const now = Date.now();
    db.set('foo', now);
    db.set('bar', now + 1000);
    replacement.foo = now - 1000;
    replacement.bar = now - 2000;
    assert.notEqual(JSON.stringify(db.JSON()), JSON.stringify(replacement), 'Replacement is equal');
    db.JSON(replacement);
    assert.equal(JSON.stringify(db.JSON()), JSON.stringify(replacement), 'Replaced structure is not equal');
  });
});

describe('Persistency', function() {
  let db = createInstance();
  db.set('foo', Date.now());
  let oldVal = db.get('foo');
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
