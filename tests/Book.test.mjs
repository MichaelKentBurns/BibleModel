
import test from 'node:test';
import { Book } from '../Book.mjs';
import * as assert from "node:assert";
import {Bible} from "../Bible.mjs";
import {Location} from "../Location.mjs";
import { HttpServer } from '../HttpServer.mjs';


const ordinal = 40;
const name = "Matthew";
const abbreviation = "Mt";
const cat = "New Testament Narrative";
const title = "The Gospel According to Matthew";
const nChapters = 28;

const row = {"order":ordinal,"title_short":name,"title_full":title,"category":cat,"chapters":nChapters};
let theBook = new Book();

test('Create a simple book', () => {
    theBook = new Book(row);
    console.log(theBook);
})

test('Check the attributes', () => {
    assert.strictEqual(theBook.ordinal,ordinal);
    assert.strictEqual(theBook.name.length,name.length);
    assert.strictEqual(theBook.name,name);
    assert.strictEqual(theBook.title,title);
    assert.strictEqual(theBook.category,cat);
    assert.strictEqual(theBook.nChapters,nChapters);
    assert.notEqual(theBook.location,null);
    assert.strictEqual(theBook.location.id,40_000_000);

});

test('find Matthew by name and an abbreviation', () => {
    // Load all books and abbreviations
    if ( ! Book.theBible)
        Book.theBible = new Bible();
    Book.loadAll(Book.theBible);
    let matthewByName = Book.getBookByName(name);
    assert.ok(matthewByName);
    let matthewByAbbreviation = Book.getBookByName(abbreviation);
    assert.ok(matthewByAbbreviation);
    assert.equal(matthewByName.order,matthewByAbbreviation.order);
    assert.notEqual(matthewByAbbreviation.location,null);
    assert.strictEqual(matthewByAbbreviation.location.id,40_000_000);
})

test('Stop the http server', () => {
    HttpServer.stopServer();
});

