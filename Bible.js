let traceBible = true;
if ( traceBible ) console.log('Bible.js Initializing');
let Book = require('./Book.js');
// let Location = require('./Location.js');
let Xref           =require('./Xref.js');
let theBible;

let waitBooksStop;
function waitBooks() {
    if ( traceBible ) console.log('Waiting for all Books. There are ', theBible.books.length, ' books loaded.');
    if (theBible.booksComplete) {
        if ( traceBible ) console.log('waitBooks: All books are loaded.');
        return true;
        clearInterval(waitBooksStop);
    }
    else return false;
}

class Bible {
    constructor() {
        this.books = [];
        this.booksComplete = false;
        this.bookInitialized = false;
        this.xrefs = [];
        this.xrefsComplete = false;
        this.xrefInitialized = false;
        this.bibleInitialized = false;
    }

    AddBook(book) {
        this.books.push(book);
        if ( traceBible ) console.log('Book added: ' + book.name);
    }

    AddXref(xref) {
        this.xrefs.push(xref);
        if ( traceBible ) console.log('Xref added: ' + xref);
    }


    LoadAll() {
        if ( traceBible ) console.log('Loading books...');
        this.booksComplete = false;
        Book.load(theBible);

    //    Book.saveAll(theBible);
    //    console.log("Books saved.");

        console.log('Loading cross references...');
        // Xref.load(theBible);
        if (theBible.xrefs != undefined) {
            if ( traceBible ) console.log('There are ', theBible.xrefs.length, ' cross references');
        }


    }
}
if ( traceBible ) console.log('Bible Class Defined.');


    theBible = new Bible();
if ( traceBible )     console.log('theBible created.');
Book.setBible(theBible);
theBible.bookInitialized = true;
Xref.setBible(theBible);
theBible.xrefInitialized = true;

if ( theBible.bookInitialized && theBible.xrefInitialized ) {

    theBible.LoadAll();
    if ( traceBible )     console.log('Waiting for books to be done loading.')
    waitBooksStop = setInterval(waitBooks, 1000);
    while ( waitBooks() == false ) {
        if ( traceBible ) console.log('Still waiting for books to be done loading.')}
    if ( traceBible ) console.log('There are ', theBible.books.length, ' books loaded.');

    if ( traceBible ) console.log('We think they must be loaded.  Are they?')

    if ( traceBible ) console.log('Done.');
}

this.bibleInitialized = true;
if ( traceBible ) console.log('Bible.js Complete.');

module.exports = Bible, theBible;