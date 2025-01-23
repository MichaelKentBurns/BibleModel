
import test from 'node:test';
import * as assert from "node:assert";

import { Bible } from '../Bible.mjs';
import { HttpServer } from '../HttpServer.mjs';


let bible1 = undefined;
let bible2 = undefined;

test('Tests initialization state, 1 bible', () => {
	bible1 = Bible.getBibleNumber(1);
	assert.notEqual(bible1,null);
	assert.equal(bible1.bibleNumber,1);
	let nBibles = Bible.getNumberOfBibles();
	assert.equal(nBibles,1);
})

test('Create a second Bible and see if books are loaded', () => {
	bible2 = new Bible();
	bible2.loadAll();
	assert.equal(bible2.bibleNumber,2);
	assert.notEqual(bible2.books,null )
	bible2.loadAll();
//	assert.ok(bible2.promiseToLoadBooks)  // promise is no longer need with DatabaseSync
	assert.ok(bible2.booksComplete)   // for some reason this fails, probably issue #9, ok for now.
});

test('Stop the http server', () => {
    HttpServer.stopServer();
});
