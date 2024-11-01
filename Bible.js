//
//  Class:  Bible
//
//  An online version of a Study Bible.
// This is the top level (primary) class that represents a web based study Bible.
//
//  Responsibilities:
//      Provide access to all contained parts.
//
//  Collaborators:
//      Testaments - a sequence of Holy texts from different faith communities,
//                  specifically Judaism and Christianity.
//      Books - a sequence of writings by various authors that constitutes the Holy Canon of a faith.
//
const traceBible = true;  // Set this true to have the inner workings of this class traced to console log.

// - - - - - - - - - Issue #1, state machine works better
// Setup state machine globals.  
// Actual state machine function is coded and called later on. 
var state;      // state number, defined in next two lines.   Can simply increment to move to next state sequentially. 
let                     state_init = 1, state_loadBooks = 2, state_waitBooks = 3, state_booksLoaded = 4, state_saveBooks = 5, state_booksSaved = 6, state_whatsNext = 7, state_shutdown = 8, state_abort = 9;
const stateNames = [ 'null', 'init',         'loadBooks',         'waitBooks',         'booksLoaded',         'saveBooks',         'booksSaved',         'whatsNext',          'shutdown',         'abort' ];
var stateNext;  // Set this from one state to indicate next state after current iteration.
var iteration;  // Everytime we run through the whole state machine section, we increment this.  
const iterationMax = 20;  // don't get stuck in a perpetual loop. 
if ( state == undefined ){    // Initial state sets up the infrastructure. 
    state = state_init;
    iteration = 1;
    if ( traceBible ) console.log('Bible.js Initializing for the first time');
}  else {
    iteration += 1;
    if ( traceBible ) console.log('Bible.js iteration ', iteration, ' state=', state, ':', stateNames[state] );
}

// - - - - - - - - - - - Resources needed .
// Various resources needed are defined here, primarily parsing the preferences file. 
const { readFileSync } = require('fs');
let scheduler;    // not universally available.
const configPath = './BibleModel-preferences.json';
const configData = readFileSync(configPath , (error) => {
    if (error) {
      console.log('An error has occurred reading configuration', error);
      return;
    }
    if ( traceBible) console.log('Data read successfully from disk');
  });
const config = JSON.parse(configData);

// - - - - - - - - - - Initialize other modules. 
if ( traceBible ) console.log('Bible.js Initializing');
let Book = require('./Book.js');
// let Location = require('./Location.js');
let Xref = require('./Xref.js');

// utility function to pause this main event loop to allow asynch tasks to run
function sleep(ms) {
    if ( traceBible ) console.log('Bible.js sleep() for ',ms,' milliseconds. time=', performance.now() );
    return new Promise(resolve => setTimeout(resolve, ms));
}

// - - - - Globals 
let theBible;   // The Bible class is a singleton and the root of the whole data model.

//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
class Bible {
    constructor() {
        this.books = [];                  // array of the books of the Bible. 
        this.booksComplete = false;       // true once the books have been loaded into array.
        this.booksReadError = undefined;  // if it fails, this is why
        this.bookInitialized = false;     // signal that books are ready.

        this.xrefs = [];                  // array of cross references 
        this.xrefsComplete = false;       // true when cross refs are all loaded 
        this.xrefInitialized = false;     // they are ready to be used

        this.bibleInitialized = false;    // basic setup is complete and ready for further requests.
    }

    // called from book loading to add each book to the collection of books
    AddBook(book) {
        this.books.push(book);
        if ( traceBible ) console.log('Bible.js Book added: ' + book.name);
    }

    // called from cross reference loading to add a new xref to the list
    AddXref(xref) {
        this.xrefs.push(xref);
        if ( traceBible ) console.log('Bible.js Xref added: ' + xref);
    }

    // Called during Bible init to trigger loading of the various components. 
    LoadAll() {
        // Books get loaded first 
        if ( traceBible ) console.log('Bible.js LoadAll() Loading books...');
        this.booksComplete = false;
        Book.loadAll(theBible);

        // Next cross references might be loaded, or may be deferred for lazy loads. 
      //  console.log('Loading cross references...');
        // Xref.load(theBible);
      //  if (theBible.xrefs != undefined) {
      //      if ( traceBible ) console.log('There are ', theBible.xrefs.length, ' cross references');
      //  }
    }
// if ( traceBible ) console.log('Bible Class Defined.');
}
//- - - - - - - - - - -end Class definition - - - - - - - - - - -
let waitingForBooks = false;

// ======================== State Machine ======================
// The stateMachine function runs a loop trying to move the state
// machine through it's state.   See StateMachine.md for a UML 
// state machine diagram. 
// The function is coded here but obviously does not run until
// the function is called below. 
function stateMachine() {
    if ( traceBible ) console.log('Bible.js =====================  stateMachine() beginning.  state=',state,' iteration=', iteration);
// = = = = = = = = = = = Begin state machine logic = = = = = = = = = = = = = = = =
while ( state < state_shutdown ) 
{
// - - - - - - initialization state sets up the data structures for data loading
if ( state == state_init ) {

    // First, create the singleton Bible structure.  
    theBible = new Bible();
    if ( traceBible )     console.log('Bible.js singleton theBible created.');
    // Tell the book and xref classes about the singleton.
    Book.setBible(theBible);
    theBible.bookInitialized = true;
    Xref.setBible(theBible);
    theBible.xrefInitialized = true;

    stateNext = 0;   // set to 0 so normal incremental state progression works. 
    state += 1;      // init complete, move on to next state. 
    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state]);
}

// - - - - - - - - first loading state is to load the list of the books, not the contents just the list.
if ( state == state_loadBooks ) {
    if (traceBible) console.log('Bible.js Requesting the loading of books...');
    theBible.LoadAll();   // ask the Bible class to load the books. 
    stateNext = state + 1;  // it will take time, so let it go to end of loop before bumping the state.
    state = 0;         // Don't consider any other states until we have come around again. 
    if ( traceBible )     console.log('Bible.js next go around, advance state to ', stateNext, stateNames[stateNext] );
}

// - - - utility function needed to check if books are loaded.  
// This part is tricky in node.js   Issue #1 requires some interesting dancing around. 

let timeoutCount = 10;

// First we define a callback function that will get called asynch
// while the books are being loaded.  This will check the signal 
// that will be sent by the promiseToLoadBooks completion callback.
function stillWaitingForBooks() {
    // Check to see if the books are loaded yet or not. 
    if ( traceBible ) 
        console.log('Bible.js stillWaitingForBooks Waiting for all Books. There are ', 
                    theBible.books.length, ' books loaded at time ', performance.now());
    // When the PromiseToLoadBooks completes it will have set booksComplete to true.
    if (theBible.booksComplete) {   // The signal has been set, so it should be done.
        if ( traceBible ) console.log('stillWaitingForBooks: theBible.booksComplete. All books are loaded.');
        clearInterval(waitBooksStop);  // Cancel the asych loop.
        // Now we need to bump the state machine to the next state.
        stateNext = 0;  
        state += 1;     // If they are all loaded then move on to next state. 
        if ( traceBible )     console.log('Bible.js stillWaitingForBooks advance state to ', state, stateNames[state] );
        return true;   // Return true so know it's complete.
    }
    else
        return false;
}

// Function to start the process of waiting for books to be loaded. 
// This function will be called by the WaitBooks state to begin a
// loop that periodically checks for completion. 
async function startWaitForBooks(){
    // The setInterval shedules a microtask that will call stillWaitingForBooks
    // every second.  
    waitBooksStop = setInterval(
        stillWaitingForBooks, // Callback function defined below.
        1000);                // gets called every 1000 ms.
    waitingForBooks = true;
    while ( !stillWaitingForBooks() && timeoutCount > 0 && !theBible.booksComplete ) {
        if ( traceBible ) console.log('Bible.js Still waiting for books to be done loading, ', timeoutCount, ' seconds to go.');
        timeoutCount--;
        await new Promise( r => setTimeout(r, 1000 ));
    }
}

// Still more dancing, this should get simplified as I learn more. 
let waitBooksStop;
// After startWaitForBooks starts it, this function monitors the process.
// 


// - - - - - - - After book loading is requested, this state calls above functions to check progress. 
if ( state == state_waitBooks ) {
    if (traceBible) console.log('Bible.js state is waiting for books to be done loading.')
    if ( !waitingForBooks ) {
        // If we have not been waiting, then kickoff the asynch loop.
        startWaitForBooks(); 
    }
    break;   // break the state machine for now.  The timeout will watch for a while. 
    stateNext = 0;
}

// - - - - - - - - - books all loaded, move on to next things. 
if ( state == state_booksLoaded ) {
    if (traceBible) console.log('Bible.js Books are done loading.')

    stateNext = 0;
    state += 1;
    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );
}

// - - - - - - - - after books loaded we want to snapshot to json, but also maybe later as well. 
if ( state == state_saveBooks ) {
    if (traceBible) console.log('Saving books as json.')

    Book.saveAll(theBible);
    console.log("Books saved??");

    stateNext = 0;
    state += 1;
    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );
}

// - - - - - - - - - 
if ( state == state_booksSaved ) {
    if (traceBible) console.log('Now books are saved, now what?.')
    console.log("Books saved!");

    stateNext = 0;
    state += 1;
    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );
}

// - - - - - - - - - Placeholder for future additions, but for now do nothing. 
if ( state == state_whatsNext ) {
    if (traceBible) console.log('Bible.js What is next?.')
    stateNext = 0;
    state += 1;
    if ( traceBible )     console.log('Bible.js advance state to ', state, stateNames[state] );
}

this.bibleInitialized = true;
if ( traceBible ) console.log('Bible.js Ready state=', state, ':', stateNames[state], ' stateNext=', stateNext, ':' , stateNames[stateNext]);

// - - - State machine complete (all states considered in this iteration.) 
if ( stateNext > 0 ) {
    state = stateNext;
    stateNext = 0;
}


if ( scheduler != undefined ) {
// - - - - - - scheduler.yield is not universally available - - - 
// at end of each iteration, yield to scheduled tasks.
    if ( traceBible ) console.log('Bible.js yields.');
    scheduler.yield();
    }
 else {
        if ( traceBible ) console. log('start nextTick');
        process.nextTick(() => {
              if ( traceBible ) console.log('nextTick callback');
              if ( state < state_shutdown ) {
                   stateMachine();  // re-run the state machine on next tick. 
              }
            });
        
        if ( traceBible ) console. log('scheduled');
        sleep(1000);  // sleep this event loop.   
        // break;   // should break the big while loop.
      }


if ( iteration > iterationMax ) {
    if ( traceBible ) console.log('Bible.js has reached maximum iterations.  Time to quit.')
    if ( state == state_shutdown )
    {
        state = state_abort;
        process.abort();
    }
        
    else
        state = state_shutdown;    
}
// done with this iteration, go around again...
iteration += 1;
if ( traceBible ) console.log('Bible.js iteration ', iteration, ' state=', state, ':', stateNames[state] );
} // = = = = = = = = = = end of state machine loop. 
if ( traceBible ) console.log('Bible.js ===================== stateMachine() ending.')
}
// ===================== end of StateMachine function. ============

// Now that the function is defined, this next call starts it 
// for the first time.   
stateMachine();   // start the state machine. 

// - - - - - - - - - Normal shutdown - - - - 
if ( state == state_shutdown ) {
   console.log('Bible.js complete, do normal shutdown.');
   // Nothing needed yet. 
}
else if ( state == state_abort ) {
    if ( traceBible ) console.log('Bible.js abnormal shutdown.');
    process.abort();
}


// - - - - - - - - - - - - 


module.exports = Bible, theBible;
