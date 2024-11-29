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
const iterationInterval = 100;   // ms to wait between checking for asynch task done.
if ( state == undefined ){    // Initial state sets up the infrastructure. 
    state = state_init;
    iteration = 1;
    if ( traceBible ) console.log('Bible.mjs Initializing for the first time');
}  else {
    iteration += 1;
    if ( traceBible ) console.log('Bible.mjs iteration ', iteration, ' state=', state, ':', stateNames[state] );
}

// - - - - - - - - - - - Resources needed .
// Various resources needed are defined here, primarily parsing the preferences file. 
import fs from 'node:fs';
let scheduler;    // not universally available.
const configPath = './BibleModel-preferences.json';
const configData = fs.readFileSync(configPath , (error) => {
    if (error) {
      console.log('An error has occurred reading configuration', error);
      return;
    }
    if ( traceBible) console.log('Data read successfully from disk');
  });
const config = JSON.parse(configData);

// - - - - - - - - - - Initialize other modules. 
if ( traceBible ) console.log('Bible.mjs Initializing');
import { Book } from './Book.mjs';  // makes promiseToReadBooks
// import Location from './Location.mjs';
//import Xref from './Xref.mjs';

// utility function to pause this main event loop to allow asynch tasks to run
function sleep(ms) {
    if ( traceBible ) console.log('Bible.mjs sleep() for ',ms,' milliseconds. time=', performance.now() );
    return new Promise(resolve => setTimeout(resolve, ms));
}

// - - - - Globals 
export let theBible;   // The Bible class is a singleton and the root of the whole data model.

//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
export class Bible {
    constructor() {
        this.libraryPath = undefined;
        this.books = [];                  // array of the books of the Bible. 
        this.promiseToLoadBooks = undefined;
        this.promiseWaitIteration = 0;
        this.booksComplete = false;       // true once the books have been loaded into array.
        this.booksReadError = undefined;  // if it fails, this is why
        this.bookInitialized = false;     // signal that books are ready.

        this.xrefs = [];                  // array of cross references 
        this.xrefsComplete = false;       // true when cross refs are all loaded 
        this.xrefInitialized = false;     // they are ready to be used

        this.bibleInitialized = false;    // basic setup is complete and ready for further requests.
    }

    getBooks()
    {
        return this.books;
    }


    // called from book loading to add each book to the collection of books
    addBook(book) {
        this.books.push(book);
        if ( traceBible ) console.log('Bible.mjs Book added: ' + book.name);
        if ( this.booksComplete || this.booksReadError || this.books.length >= 66 ) {
            console.log('Bible.mjs booksComplete=',this.booksComplete, ' books.length=', this.books.length );
            if ( this.books.length >= 66 ) this.booksComplete = true;
        }

    }

    // called from cross reference loading to add a new xref to the list
    addXref(xref) {
        this.xrefs.push(xref);
        if ( traceBible ) console.log('Bible.mjs Xref added: ' + xref);
    }

    // Called during Bible init to trigger loading of the various components. 
    loadAll() {
        // Books get loaded first 
        if ( traceBible ) console.log('Bible.mjs LoadAll() Loading books...');
        this.booksComplete = false;
        this.promiseToLoadBooks = Book.loadAll(theBible);
        if ( traceBible ) console.log('A promise to load all books = ', this.promiseToLoadBooks);
        // Next cross references might be loaded, or may be deferred for lazy loads. 
      //  console.log('Loading cross references...');
        // Xref.load(theBible);
      //  if (theBible.xrefs != undefined) {
      //      if ( traceBible ) console.log('There are ', theBible.xrefs.length, ' cross references');
      //  }
    }
    // ======================== State Machine ======================
// The stateMachine function runs a loop trying to move the state
// machine through it's state.   See StateMachine.md for a UML 
// state machine diagram. 
// The function is coded here but obviously does not run until
// the function is called below. 
stateMachine = async function stateMachine() {
    if (traceBible) console.log('Bible.mjs =====================  stateMachine() beginning time=', performance.now(), ' state=', state, ' iteration=', iteration);
    // = = = = = = = = = = = Begin state machine logic = = = = = = = = = = = = = = = =
    while (state < state_shutdown) {
        // - - - - - - initialization state sets up the data structures for data loading
        if (state == state_init) {
            if (traceBible) console.log('Bible.mjs state_init');

            // Tell the book and xref classes about the singleton.
            if (theBible) Book.setBible(theBible);
            theBible.bookInitialized = true;
        //    if ( theBible) Xref.setBible(theBible);
        //    theBible.xrefInitialized = true;

            stateNext = 0;   // set to 0 so normal incremental state progression works. 
            state += 1;      // init complete, move on to next state. 
            if (traceBible) console.log('Bible.mjs advance state to ', state, stateNames[state]);
        }

        // - - - - - - - - first loading state is to load the list of the books, not the contents just the list.
        if (state == state_loadBooks) {
            if (traceBible) console.log('Bible.mjs Requesting the loading of books...');
            this.promiseToLoadBooks = undefined;
            theBible.loadAll();   // ask the Bible class to load the books. 
            if ( this.promiseToLoadBooks != undefined ) {
                if (traceBible) console.log('Bible.mjs we have a promise to read books. Change state to wait.');
                state = state + 1;  // it will take time, so let it go to end of loop before bumping the state.
                stateNext = 0;         // Don't consider any other states until we have come around again. 
                if (traceBible) console.log('Bible.mjs next go around, advance state to ', stateNext, stateNames[stateNext]);
            }
            else {
                if (traceBible) console.log('Check if books loaded without a promise to wait on.');
                if ( this.booksComplete && this.books.length > 0 ) {
                    if ( traceBible ) console.log('Bible.mjs books are complete and not empty. Move to booksLoaded without waiting.');
                    state = state_booksLoaded;
                }
            }
        }

        // - - - utility function needed to check if books are loaded.  
        // This part is tricky in node.js   Issue #1 requires some interesting dancing around. 

        let timeoutCount = 10;
        let waitBooksStop;  // a timer interval while waiting

        // First we define a callback function that will get called asynch
        // while the books are being loaded.  This will check the signal 
        // that will be sent by the promiseToLoadBooks completion callback.
        function stillWaitingForBooks() {
            // Check to see if the books are loaded yet or not. 
            if (traceBible)
                console.log('Bible.mjs stillWaitingForBooks Waiting for all Books. There are ',
                    theBible.books.length, ' books loaded at time ', performance.now());
            // When the PromiseToLoadBooks completes it will have set booksComplete to true.
            if (theBible.booksComplete) {   // The signal has been set, so it should be done.
                if (traceBible) console.log('stillWaitingForBooks: theBible.booksComplete. All books are loaded.');
                clearInterval(waitBooksStop);  // Cancel the asych loop.
                waitBooksStop = undefined;
                if (state == state_waitBooks) {
                    // Now we need to bump the state machine to the next state.
                    stateNext = 0;
                    state += 1;     // If they are all loaded then move on to next state. 
                    if (traceBible) console.log('Bible.mjs stillWaitingForBooks advance state to ', state, stateNames[state]);
                }
                return true;   // Return true so know it's complete.
            }
            else
                return false;
        }

        // Function to start the process of waiting for books to be loaded. 
        // This function will be called by the WaitBooks state to begin a
        // loop that periodically checks for completion. 
        async function startWaitForBooks() {
            // The setInterval shedules a microtask that will call stillWaitingForBooks
            // every second.  
            if (traceBible) console.log('Bible.mjs startWaitForBooks - setInterval');
            waitBooksStop = setInterval(
                stillWaitingForBooks, // Callback function defined below.
                iterationInterval);   // gets called every once in a while.
            waitingForBooks = true;
            while (!stillWaitingForBooks() && timeoutCount > 0 && !theBible.booksComplete) {
                if (traceBible) console.log('Bible.mjs Still waiting for books to be done loading, time=', performance.now(), ' ', timeoutCount, ' seconds to go.');
                timeoutCount--;
                await new Promise( r => setTimeout(r, 1000 ));
            }
        }

        // After startWaitForBooks starts it, this function monitors the process.
        // 


        // - - - - - - - After book loading is requested, this state calls above functions to check progress. 
        if (state == state_waitBooks) {
            if (traceBible) console.log('Bible.mjs state is waiting for books to be done loading.')
            
            function handleResolve(value) {
                console.log('Data received:', value);
                theBible.books = value;
                state = state_booksLoaded;
                theBible.stateMachine();
            }

            function handleReject(error) {
                console.log('Error:', error );
                theBible.booksReadError = error;
                state = state_shutdown;
                theBible.stateMachine();
            }

            if ( theBible.promiseToLoadBooks != undefined ) {
                 theBible.promiseToLoadBooks.then(handleResolve,handleReject);
                }
          //  if (!waitingForBooks) {
                // If we have not been waiting, then kickoff the asynch loop.
          //      startWaitForBooks();
          //  }
            //break;   // break the state machine for now.  The timeout will watch for a while. 
            stateNext = 0;
        }

        // - - - - - - - - - books all loaded, move on to next things. 
        if (state == state_booksLoaded) {
            if (traceBible) console.log('Bible.mjs Books are done loading.')
            if (waitBooksStop)
                clearInterval(waitBooksStop);  // Cancel the asych loop.

            stateNext = 0;
            state += 1;
            if (traceBible) console.log('Bible.mjs advance state to ', state, stateNames[state]);
        }

        // - - - - - - - - after books loaded we want to snapshot to json, but also maybe later as well. 
        if (state == state_saveBooks) {
            if (traceBible) console.log('Saving books as json.')

            Book.saveAll(theBible);
            console.log("Books saved??");

            stateNext = 0;
            state += 1;
            if (traceBible) console.log('Bible.mjs advance state to ', state, stateNames[state]);
        }

        // - - - - - - - - - 
        if (state == state_booksSaved) {
            if (traceBible) console.log('Now books are saved, now what?.')
            console.log("Books saved!");

            stateNext = 0;
            state += 1;
            if (traceBible) console.log('Bible.mjs advance state to ', state, stateNames[state]);
        }

        // - - - - - - - - - Placeholder for future additions, but for now do nothing. 
        if (state == state_whatsNext) {
            if (traceBible) console.log('Bible.mjs What is next?.')
            stateNext = 0;
            state += 1;
            if (traceBible) console.log('Bible.mjs advance state to ', state, stateNames[state]);
        }

        this.bibleInitialized = true;
        if (traceBible) console.log('Bible.mjs Ready state=', state, ':', stateNames[state], ' stateNext=', stateNext, ':', stateNames[stateNext]);

        // - - - State machine complete (all states considered in this iteration.) 
        if (stateNext > 0) {
            state = stateNext;
            stateNext = 0;
        }


        if (scheduler != undefined) {
            // - - - - - - scheduler.yield is not universally available - - - 
            // at end of each iteration, yield to scheduled tasks.
            if (traceBible) console.log('Bible.mjs yields.');
            scheduler.yield();
        }
        else {

        if (this.promiseWaitIteration > iterationMax) {
            if (traceBible) console.log('Bible.mjs stateMachine has reached maximum iterations.  Time to quit.')
            if (state == state_shutdown) {
                state = state_abort;
               // process.abort();
            }

            else
                state = state_shutdown;
        }
            if (traceBible) console.log('start nextTick');
            process.nextTick(() => {
                if (traceBible) console.log('nextTick callback');
                if (state < state_shutdown) {
                    theBible.stateMachine();  // re-run the state machine on next tick. 
                }
            });

            if (traceBible) console.log('scheduled');
            //var sleepPromise = sleep(1000);  // sleep this event loop.  
          //  var sleepResult = await sleepPromise; 
        //    var loadBooksResult = await this.promiseToLoadBooks;
        //    if (loadBooksResult == undefined ) break;   // should break the big while loop.
        }


        if (iteration > iterationMax) {
            if (traceBible) console.log('Bible.mjs has reached maximum iterations.  Time to quit.')
            if (state == state_shutdown) {
                state = state_abort;
              //  process.abort();
            }

            else
                state = state_shutdown;
        }
        // done with this iteration, go around again...
        iteration += 1;
        this.promiseWaitIteration += 1;
        if (traceBible) console.log('Bible.mjs iteration ', iteration, ' state=', state, ':', stateNames[state]);
    } // = = = = = = = = = = end of state machine loop. 
    if (traceBible) console.log('Bible.mjs ===================== stateMachine() ending. time=', performance.now())
}
// ===================== end of StateMachine function. ============
// if ( traceBible ) console.log('Bible Class Defined.');
}
//- - - - - - - - - - -end Class definition - - - - - - - - - - -
let waitingForBooks = false;

//- - - - - - - - - - -  initialize configuration data and other resources. - - - - 

if (state == state_init) {

    // First, create the singleton Bible structure.  
    theBible = new Bible();
    if (traceBible) console.log('Bible.mjs singleton theBible created.');
    // A Bible requires a Library directory to store data.
    let libraryPath = config.LibraryPath;
    theBible.libraryPath = libraryPath;
    if (!fs.existsSync(libraryPath)) {
        fs.mkdirSync(libraryPath, { recursive: true });
        if (traceBible) console.log('Bible Library directory created: ', libraryPath);
    }
}



// Now that the function is defined, this next call starts it 
// for the first time.   
if ( state >= state_init && state <= state_shutdown ){
    if ( traceBible )  console.log('Bible.mjs startStateMachine');
    theBible.stateMachine();   // start the state machine. 
}

// - - - - - - - - - Normal shutdown - - - - 
if ( state == state_shutdown ) {
   console.log('Bible.mjs complete, do normal shutdown.');
   // Nothing needed yet. 
}
else if ( state == state_abort ) {
    if ( traceBible ) console.log('Bible.mjs abnormal shutdown.');
    process.abort();
}


// - - - - - - - - - - - - 
export default {
   Bible,
    theBible

}

