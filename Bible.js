const traceBible = true;
var state;
let                             state_init = 1, state_loadBooks = 2, state_waitBooks = 3, state_booksLoaded = 4, state_saveBooks = 5, state_booksSaved = 6, state_whatsNext = 7;
const stateNames = [ 'null', 'init',        'loadBooks',          'waitBooks',         'booksLoaded',         'saveBooks',         'booksSaved',         'whatsNext' ];
var stateNext;
var iteration;
if ( state == undefined ){
    state = state_init;
    iteration = 1;
    if ( traceBible ) console.log('Bible.js Initializing for the first time');
}  else {
    iteration += 1;
    if ( traceBible ) console.log('Bible.js iteration ', iteration, ' state=', state, ':', stateNames[state] );
}

if ( traceBible ) console.log('Bible.js Initializing');
let Book = require('./Book.js');
// let Location = require('./Location.js');
let Xref = require('./Xref.js');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let theBible;

//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
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

        console.log('Loading cross references...');
        // Xref.load(theBible);
        if (theBible.xrefs != undefined) {
            if ( traceBible ) console.log('There are ', theBible.xrefs.length, ' cross references');
        }
    }
// if ( traceBible ) console.log('Bible Class Defined.');
}
//- - - - - - - - - - -end Class definition - - - - - - - - - - -

if ( state == state_init ) {
    theBible = new Bible();
    if ( traceBible )     console.log('theBible created.');
    Book.setBible(theBible);
    theBible.bookInitialized = true;
    Xref.setBible(theBible);
    theBible.xrefInitialized = true;

    stateNext = 0;
    state += 1;
    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state]);
}

if ( state == state_loadBooks ) {
    if (traceBible) console.log('Loading books...');
    theBible.LoadAll();
    stateNext = 0;
    state += 1;
    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );
}

async function waitForBooks(){
    let timeoutCount = 10;
    waitBooksStop = setInterval(waitBooks, 1000);
    while ( !waitBooks() && timeoutCount > 0 && !theBible.booksComplete ) {
        if ( traceBible ) console.log('Still waiting for books to be done loading, ', timeoutCount, ' seconds to go.');
        timeoutCount--;
        await new Promise( r=> setTimeout(r, 1000 ));
    }
}

let waitBooksStop;
function waitBooks() {
    if ( traceBible ) console.log('Waiting for all Books. There are ', theBible.books.length, ' books loaded.');
    if (theBible.booksComplete) {
        if ( traceBible ) console.log('waitBooks: All books are loaded.');
        clearInterval(waitBooksStop);
        stateNext = 0;
        state += 1;
        if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );
        console.log('Might as well try to save now...');
        Book.saveAll(theBible);
        console.log("Books saved??");
        stateNext = 0;
        state += 1;
        if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );
        return true;
    }
    else
        return false;
}

if ( state == state_waitBooks ) {
    if (traceBible) console.log('Waiting for books to be done loading.')
    waitForBooks();
    if (traceBible) console.log('There are ', theBible.books.length, ' books loaded.');
    if (traceBible) console.log('We think they must be loaded.  Are they?')
    if (traceBible) console.log('Done.');
    stateNext = 0;
//    state += 1;
//    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );

}


if ( state == state_booksLoaded ) {
    if (traceBible) console.log('Books are done loading.')

    stateNext = 0;
    state += 1;
    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );
}


if ( state == state_saveBooks ) {
    if (traceBible) console.log('Saving books as json.')

    Book.saveAll(theBible);
    console.log("Books saved??");

    stateNext = 0;
    state += 1;
    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );
}


if ( state == state_booksSaved ) {
    if (traceBible) console.log('Now books are saved, now what?.')
    console.log("Books saved!");

    stateNext = 0;
    state += 1;
    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );
}

this.bibleInitialized = true;
if ( traceBible ) console.log('Bible.js Complete state=', state, ':', stateNames[state], ' stateNext=', stateNext, ':' , stateNames[stateNext]);
if ( stateNext > 0 ) {
    state = stateNext;
}
else {
    console. log('start nextTick');
    process.nextTick(() => {
        console. log('nextTick callback');
        });
    console. log('scheduled');
}


module.exports = Bible, theBible;
