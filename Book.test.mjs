

import Book from './Book.mjs';
const row = {"order":40,"title_short":"Matthew","title_full":"The Gospel According to Matthew","category":"New Testament Narrative","chapters":28};
const  theBook = new Book(row);
console.log(theBook);

const ordinal = 40;
const name = "Matthew";
const cat = "New Testament Narrative";
const title = "The Gospel According to Matthew";
const nChapters = 28;

test('Create a simple book and check the attributes', () => {
    expect(theBook.ordinal).toEqual(ordinal);
    expect(theBook.name.length).toEqual(name.length);
    expect(theBook.name).toEqual(name);
    expect(theBook.title).toEqual(title);
    expect(theBook.category).toEqual(cat);
    expect(theBook.nChapters).toEqual(nChapters);


});
