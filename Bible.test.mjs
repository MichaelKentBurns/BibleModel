
import test from 'node:test';
import * as assert from "node:assert";

import { Bible } from './Bible.mjs';
const  theBible = new Bible();

theBible.loadAll();

test('Starts Bible and see if books are loaded', () => {
	assert.ok(theBible.books)
	assert.notEqual(theBible.books,undefined )
	theBible.loadAll();
//	assert.ok(theBible.promiseToLoadBooks)  // promise is no longer need with DatabaseSync
	assert.ok(theBible.booksComplete)
});
