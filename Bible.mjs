
//mm # Class:  Bible
//mm
//mm An online version of a Study Bible.
//mm This is the top level (primary) class that represents a web based study Bible.
//mm
//mm ## Responsibilities:
//mm Provide access to all contained parts.
//mm
//mm ## Collaborators:
//mm * Testaments - a sequence of Holy texts from different faith communities,
//mm                  specifically Judaism and Christianity.
//mm * Books - a sequence of writings by various authors that constitutes the Holy Canon of a faith.
//mm
//mm ```mermaid
//mm classDiagram

const BibleVersion = "0.2.2";

const traceBible = false;  // Set this true to have the inner workings of this class traced to console log.
const useHttp2 = false;

// - - - - - - - - - Issue #1, state machine works better
// Setup state machine globals.  
// Actual state machine function is coded and called later on. 
var state;      // state number, defined in next two lines.   Can simply increment to move to next state sequentially. 
let state_init = 1, state_loadBooks = 2, state_booksLoaded = 3, state_saveBooks = 4, state_booksSaved = 5,
    state_httpServer = 6, state_shutdown = 7, state_abort = 8;
const stateNames = ['null', 'init', 'loadBooks', 'booksLoaded', 'saveBooks', 'booksSaved', 'httpServer', 'shutdown', 'abort'];
var stateNext;  // Set this from one state to indicate next state after current iteration.
var iteration;  // Everytime we run through the whole state machine section, we increment this.  
const iterationMax = 20;  // don't get stuck in a perpetual loop. 
const iterationInterval = 100;   // ms to wait between checking for asynch task done.
if (state === undefined) {    // Initial state sets up the infrastructure.
    state = state_init;
    console.log(`BibleModel: Bible version ${BibleVersion}`);
    iteration = 1;
    if (traceBible) console.log('Bible.mjs Initializing for the first time');
} else {
    iteration += 1;
    if (traceBible) console.log('Bible.mjs iteration ', iteration, ' state=', state, ':', stateNames[state]);
}

// - - - - - - - - - - - Resources needed .
// Various resources needed are defined here, primarily parsing the preferences file. 
import fs from 'node:fs';

const configPath = './BibleModel-preferences.json';
const configData = fs.readFileSync(configPath, (error) => {
    if (error) {
        console.log('An error has occurred reading configuration', error);
        return;
    }
    if (traceBible) console.log('Data read successfully from disk');
});
const config = JSON.parse(configData);
const root = '/Bible';
console.log(root);

const overview =
    `Welcome to the "overview page" of the BibleModel REST server version ${BibleVersion}.\n\
        Request:\n\
        ${root}/ or \n\
        ${root}/overview to receive this overview. \n\
        ${root}/status to check the status of this server. \n\
        ${root}/preferences to receive the current preferences.\n\
        ${root}/versions to receive the list of Bible versions.\n\
        ${root}/bible to receive entire Bible current state.\n\
        ${root}/books to receive list of books.\n\
        ${root}/bookAbbreviation to receive list of all abbreviated book names.\n\
        ${root}/book/{name} to receive a specific book by name.\n\
        ${root}/book/{number} to receive a specific book by name.\n\
        ${root}/book/{name or number}/contents to receive a specific book and it\'s contents.\n\
        ${root}/notes to receive all notes.\n\
        ${root}/note/{number} to receive a specific note.\n\
        ${root}/stop to shut-down this server.`;

// - - - - - - - - - - Initialize other modules. 
if (traceBible) console.log('Bible.mjs Initializing');
import {Version} from './Version.mjs';
import {Book} from './Book.mjs';  // makes promiseToReadBooks
import { DataSource } from './DataSource.mjs';
import { Location } from './Location.mjs';
import { Xref } from './Xref.mjs';
import { Note } from './Note.mjs';
import { NoteList } from './NoteList.mjs';

 //   import {Http2Server} from './Http2Server.mjs';
import {HttpServer} from './Servers/HttpServer.mjs';
import {
    HTTPserverStart,
    HTTPserverSetPort,
    HTTPserverGetPort,
    HTTPserverStop,
    HTTPserverRequestCount
} from './Servers/RESTServer/HTTPserver.mjs';
import {RESTendpoint} from './Servers/RESTServer/RESTendpoint.mjs';

// utility function to pause this main event loop to allow asynch tasks to run
function sleep(ms) {
    if (traceBible) console.log('Bible.mjs sleep() for ', ms, ' milliseconds. time=', performance.now());
    return new Promise(resolve => setTimeout(resolve, ms));
}

// - - - - Globals 

let theBible;   // The Bible class is a singleton and the root of the whole data model.
let numBibles = 0;
let allBibles = [];
let defaultBible = undefined;
let defaultBibleTableName = undefined;

//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
//mm    class Bible {
export class Bible {
    static version = BibleVersion;
    constructor() {
        numBibles += 1;   // count them all
        // Private ///////////////////////  Only used by this class itself
        //mm  -bibleNumber              // ordinal among all of the Bibles loaded
        this.bibleNumber = numBibles;   // each is numbered sequentially
        if ( traceBible ) console.log("Bible.mjs - Bible #", this.bibleNumber, " created");
        allBibles.push(this);
        //mm  -libraryPath
        this.bibleLibraryPath = undefined;

        this.promiseWaitIteration = 0;
        this.booksComplete = false;       // true once the books have been loaded into array.
        this.booksReadError = undefined;  // if it fails, this is why
        this.bookInitialized = false;     // signal that books are ready.

        // Protected /////////// Only to be used by other classes in this package

        this.bibleInitialized = false;    // basic setup is complete and ready for further requests.
        this.xrefsComplete = false;       // true when cross refs are all loaded
        this.xrefInitialized = false;     // they are ready to be used

        // Public  ////////////////////////////////  Can be used by code outside this package
        //mm   +String  translationCode
        this.translationCode = undefined;
        //mm   +String  translationName
        this.translationName = undefined;
        //mm   +Testament[] testaments
        this.testaments = []
        //mm   +Book[] books
        this.books = [];                  // array of the books of the Bible.
        //mm   +Xrefs[] Xref              // array of cross references
        this.xrefs = [];                  // array of cross references
        //mm   +Notes[] Notes              // array of cross references
        this.notes = [];                  // array of cross references

        //mm   +DataSource dSource          // database containing persisted data
        this.dSource = new DataSource();
        //mm   +Object  config            // preferences configuration
        this.config = config;
    }

    //mm ///// statics - medhods belonging to the class, not an instance  ed.  Bible.getBible()
    //mm  getBible()$    // returns the singleton Bible
    static getBible() {
        return theBible;
    }

    //mm  getConfig()$   // returns configuration preferences
    static getConfig() {
        return config;
    }

    //mm  getBibleNumber(n)$  // returns the nth Bible open
    static getBibleNumber(n) {
        if ( n > 0 && n <= numBibles )
            return allBibles[n-1];
        else return null;
    }

    //mm  getNumberOfBibles()$ number     // returns the number of open Bibles
    static getNumberOfBibles() {
        return numBibles;
    }

    //mm ///// instance methods - belong to a specific Bible   eg.  aBible.getBooks()
    //mm +getBooks()   Book[]   // returns array of all the books
    getBooks() {
        return this.books;
    }


    //mm ~addTestament(testament)  // add a new testament to the Bible
    addTestament(testament) {
        this.testaments.push(testament);
        if (traceBible) console.log('Bible.mjs Testament added: ' + testament);
    }

    // called from book loading to add each book to the collection of books
    //mm ~addBook(book)  // add a new book to the Bible
    addBook(book) {
        this.books.push(book);
        if (traceBible) console.log('Bible.mjs Book added: ' + book.name + ' added to Bible #' + this.bibleNumber);
        if (this.booksComplete || this.booksReadError || this.books.length >= 66) {
            if (traceBible) console.log('Bible.mjs booksComplete=', this.booksComplete, ' books.length=', this.books.length);
            if (this.books.length >= 66) this.booksComplete = true;
        }

    }

    //mm ~addXref(xref)  // called from cross reference loading to add a new xref to the list
    addXref(xref) {
        this.xrefs.push(xref);
        if (traceBible) console.log('Bible.mjs Xref added: ' + xref);
    }

    //mm ~loadAll()    // Called during Bible init to trigger loading of the various components.
    loadAll() {

        // If versions are not already load them, then do it once. 
        let currentVersions = Version.getVersions();
        if (currentVersions == undefined || currentVersions.length == 0) {
            Version.loadAll();
            currentVersions = Version.getVersions();
            if (config.Translation != undefined) {
                let translation = config.Translation;
                defaultBible = Version.getVersionNamed(translation);
                defaultBibleTableName = Version.getVersionNamedTableName(translation);
            }
        }

        // Books get loaded
        if (traceBible) console.log('Bible.mjs LoadAll() Loading books...');
        this.booksComplete = false;
        this.booksReadError = Book.loadAll(theBible);
        if (this.booksReadError && traceBible) console.log(this.booksReadError);

        // Next cross references might be loaded, or may be deferred for lazy loads. 
        if (traceBible) console.log('Bible.mjs Loading cross references...');
        Xref.loadAll(theBible);
        if (theBible.xrefs != undefined) {
            if (traceBible) console.log('There are ', theBible.xrefs.length, ' cross references');
        }

        // Finally, notes get loaded.
        this.notes = NoteList.loadAll();
    }

    // ======================== State Machine ======================
    // The stateMachine function runs a loop trying to move the state
    // machine through it's state.   See StateMachine.md for a UML
    // state machine diagram.
    // The function is coded here but obviously does not run until
    // the function is called below.
    //mm  -stateMachine()       // starts or continues execution of state machine
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
                theBible.loadAll();   // ask the Bible class to load the books.
                if (this.booksComplete && this.books.length > 0) {
                    if (traceBible) console.log('Bible.mjs books are complete and not empty. Move to booksLoaded without waiting.');
                    state = state_booksLoaded;
                }
            }

            // - - - utility function needed to check if books are loaded.
            // This part is tricky in node.js   Issue #1 requires some interesting dancing around.

            let timeoutCount = 10;
            let waitBooksStop;  // a timer interval while waiting

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
                if (traceBible) console.log('Bible.mjs Saving books as json.')

                Book.saveAll(theBible);
                if (traceBible) console.log("Bible.mjs Books saved.");

                stateNext = 0;
                state += 1;
                if (traceBible) console.log('Bible.mjs advance state to ', state, stateNames[state]);
            }

            // - - - - - - - - -
            if (state == state_booksSaved) {
                if (traceBible) console.log('Bible.mjs Now books are saved.')
                stateNext = 0;
                state += 1;
                if (traceBible) console.log('Bible.mjs advance state to ', state, stateNames[state]);
            }

            // - - - - - - - - - Placeholder for future additions, but for now do nothing.
            if (state == state_httpServer) {
                if (traceBible) console.log('Bible.mjs Initialize and start http server...')
                if ( config.RESTServer === "RESTServer" ) {
                    HTTPserverSetPort(config.RESTPort);
                    HTTPserverStart();
                }
                else if ( useHttp2 ) {
                    Http2Server.setup();
                    Http2Server.activateServer();
                } else
                {
                    HttpServer.setup();
                    HttpServer.activateServer();
                }

                // Not sure how we get here, and what triggers it?
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

            if (this.promiseWaitIteration > iterationMax) {
                if (traceBible) console.log('Bible.mjs stateMachine has reached maximum iterations.  Time to quit.')
                if (state == state_shutdown) {
                    state = state_abort;
                    // process.abort();
                } else
                    state = state_shutdown;
            }

            if (traceBible) console.log('start nextTick');
            process.nextTick(() => {
                if (traceBible) console.log('nextTick callback');
                if (state < state_shutdown) {
                    theBible.stateMachine();  // re-run the state machine on next tick.
                }
            });

            if (traceBible) console.log('Bible.mjs - scheduled for re-iteration.');

            if (iteration > iterationMax) {
                if (traceBible) console.log('Bible.mjs has reached maximum iterations.  Time to quit.')
                if (state == state_shutdown) {
                    state = state_abort;
                    //  process.abort();
                } else
                    state = state_shutdown;
            }
            // done with this iteration, go around again...
            iteration += 1;
            this.promiseWaitIteration += 1;
            if (traceBible) console.log('Bible.mjs iteration ', iteration, ' state=', state, ':', stateNames[state]);

        }
        // = = = = = = = = = = end of state machine loop.
        if (traceBible) console.log('Bible.mjs ===================== stateMachine() ending. time=', performance.now());
    }
// ===================== end of StateMachine function. ============

    static handleOverview( endpoint, request, response, urlArray, urlOptionsArray ) {
        if ( request.method === 'GET' )
        {
            response.setHeader("Content-Type","text/plain");
            response.writeHead(200);
            response.end( overview + '\n');
        }
    }

    static handleStatus( endpoint, request, response, urlArray, urlOptionsArray ) {
        if ( request.method === 'GET' )
        {
            response.setHeader("Content-Type","application/json");
            response.writeHead(200);
            let status =
                {
                    BibleVersion: BibleVersion,
                    processId: process.pid,
                    processArgv: process.argv,
                    processEnv: process.env,
                    processCPU: process.cpuUsage,
                    processMemoryUsage: process.memoryUsage,
                    bibleLoaded: Bible.getBible().bibleInitialized,
                    httpPort: request.httpPort,
                    server: "up",
                    requestCount: HTTPserverRequestCount(),
                    nothing: 0
                }
            response.end( JSON.stringify(status) + '\n');
        }
    }

    static handlePreferences( endpoint, request, response, urlArray, urlOptionsArray ) {
          if ( request.method === 'GET' )
             {
              response.setHeader("Content-Type","application/json");
              response.writeHead(200);
              response.end(
                  JSON.stringify(Bible.getBible().config) + '\n');
             }
         }

    static handleStop( endpoint, request, response, urlArray, urlOptionsArray ) {
        if ( request.method === 'GET' )
        {
            HTTPserverStop();
            response.setHeader("Content-Type","text/plain");
            response.writeHead(200);
            response.end( 'Server Stopped.\n');
        }
    }

    static handleBible( endpoint, request, response, urlArray, urlOptionsArray ) {
        if ( request.method === 'GET' )
        {
            response.setHeader("Content-Type","application/json");
            response.writeHead(200);
            response.end( JSON.stringify(Bible.getBible()) + '\n');
        }
    }

    static handleVersions( endpoint, request, response, urlArray, urlOptionsArray ) {
        if ( request.method === 'GET' )
        {
            response.setHeader("Content-Type","application/json");
            response.writeHead(200);
            response.end( JSON.stringify(Version.getVersions()) + '\n');
        }
    }


    static registerEndpoints(){

        let endpoint;
        endpoint = new RESTendpoint( "overview", Bible, Bible.handleOverview );
        RESTendpoint.registerEndpoint( endpoint );
        endpoint = new RESTendpoint( "", Bible, Bible.handleOverview );
        RESTendpoint.registerEndpoint( endpoint );

        endpoint = new RESTendpoint( "status", Bible, Bible.handleStatus );
        RESTendpoint.registerEndpoint( endpoint );

        endpoint = new RESTendpoint( "preferences", Bible, Bible.handlePreferences );
        RESTendpoint.registerEndpoint( endpoint );

        endpoint = new RESTendpoint( "stop", Bible, Bible.handleStop );
        RESTendpoint.registerEndpoint( endpoint );

        endpoint = new RESTendpoint( "bible", Bible, Bible.handleBible );
        RESTendpoint.registerEndpoint( endpoint );

        endpoint = new RESTendpoint( "versions", Bible, Bible.handleVersions );
        RESTendpoint.registerEndpoint( endpoint );
    }

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
    let MyBiblePath = config.MyBiblePath;
    theBible.bibleLibraryPath = MyBiblePath;
    if (!fs.existsSync(MyBiblePath)) {
        fs.mkdirSync(MyBiblePath, {recursive: true});
        if (traceBible) console.log('Bible Library directory created: ', MyBiblePath);
    }
    if (traceBible) console.log('Bible - registering REST endpoints.');

    Bible.registerEndpoints();
}


// Now that the function is defined, this next call starts it
// for the first time.   
if (state >= state_init && state <= state_shutdown) {
    if (traceBible) console.log('Bible.mjs startStateMachine');
    theBible.stateMachine();   // start the state machine. 
}

// - - - - - - - - - Normal shutdown - - - - 
if (state == state_shutdown) {
    console.log('Bible.mjs complete, do normal shutdown.');
    // Nothing needed yet.
} else if (state == state_abort) {
    if (traceBible) console.log('Bible.mjs abnormal shutdown.');
    process.abort();
}
//mm }
//mm class Book {
//mm  +integer ordinal
//mm  +String  name
//mm }
//mm Bible *-- Book
//mm class Testament {
//mm   +integer ordinal
//mm   +String  name
//mm }
//mm Bible *-- Testament
//mm Testament *-- Book
//mm ```

// - - - - - - - - - - - - 
export default {
    Bible,
    theBible

}

