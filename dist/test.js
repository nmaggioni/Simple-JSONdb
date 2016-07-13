'use strict';

// TODO: proper testing suite

var JSONdb = require('./jsondb');
var db = new JSONdb('/tmp/database.json');

console.log('Is "db" and instance of "JSONdb"?: ' + (db instanceof JSONdb).toString().toUpperCase());

console.log('Getting key "foo": ' + db.get('foo'));

console.log('Setting key "foo"');
db.set('foo', new Date().toISOString());

console.log('Getting key "foo": ' + db.get('foo'));

console.log('Syncing db');
db.sync();
