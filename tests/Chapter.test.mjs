
import test from 'node:test';
import * as assert from "node:assert";
import {Bible} from "../Bible.mjs";
import { Book } from '../Book.mjs';
import {Chapter} from "../Chapter.mjs";
import { HttpServer } from '../Servers/HttpServer.mjs';

const ordinal = 40;
const name = "Matthew";
const abbreviation = "Mt";
const cat = "New Testament Narrative";
const title = "The Gospel According to Matthew";
const nChapters = 28;
let matthew;
let matthew1;
let mark;

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
    matthew = matthewByName;
    Book.loadContents(matthew);
    console.log("Matthew: ", matthew);

})

test('Add a chapter to Matthew',  () => {
    const chapter1 = new Chapter(theBook,1);
    matthew1 = chapter1;
    theBook.chapters.push(chapter1);
    chapter1.addNote("Matthew's gospel proves that Jesus is Messiah, the Christ");
  //  chapter1.caption("The beginning of the story...")
    console.log("The Book: ", theBook);
    console.log("The Chapter: ",chapter1);

    assert.notEqual(theBook.location,null);
    assert.strictEqual(theBook.location.id,40_000_000);

    assert.notEqual(chapter1.location,null);
    let matthewId = theBook.location.id;
    let matthew1Id = chapter1.location.id;
    assert.strictEqual(matthew1Id,40_001_000);

    mark = Book.getBookByName("Mark");
    let markId = mark.location.id;
    assert.ok( (matthew1Id > matthewId && matthew1Id < markId ) ); 

});


test('Find that chapter in Matthew and verify it.',  () => {
    const firstChapter = matthew.chapters[1-1];
    console.log("matthew1: ", matthew1 );
    console.log("firstChapter: ", firstChapter );

  //  assert.strictEqual(matthew1,firstChapter);   // one has a note, not strictly equal
    assert.notEqual(matthew.location,null);
    assert.strictEqual(matthew.location.id,40_000_000);

    assert.notEqual(firstChapter.location,null);
    assert.strictEqual(firstChapter.location.id,40_001_000);
});

test('Stop the http server', () => {
    HttpServer.stopServer();
});
