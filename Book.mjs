//mm  # Class:  Book
//mm
//mm  A holy writing considered as part of the Canon of a faith.
//mm  A Book is ultimately a sequence of words with appropriate punctuation.
//mm  In modern forms it is composed of a sequence of chapters.
//mm  Usually attributed to a specific author.
//mm
//mm  ### Responsibilities:
//mm  * The formal name.
//mm  * A longer descriptive name.
//mm  * Abbreviations for the name.
//mm  * The name of the author.
//mm  * Introductory text.
//mm
//mm  ### Collaborators:
//mm  * The Bible that contains this book.
//mm  * The Testament that contains this book.
//mm  * Chapters - A sequence of numbered chapters that form this book.
//mm
//mm ```mermaid
//mm classDiagram

import {RESTendpoint} from "./Servers/RESTServer/RESTendpoint.mjs";

const traceBook = true;
const traceData = true;

if (traceBook) console.log('Book.mjs initializing.');
import fs from 'node:fs';
import {Bible} from './Bible.mjs';
import {Chapter} from './Chapter.mjs';
// import {Verse} from './Verse.mjs';
import {Location} from './Location.mjs';


let allBooks;  // array of books loaded
// In saveBooks below we cache the list of books in a JSON file.
// If we find it still there, this will read it in to avoid a trip to database.
const readBooksJson = true;      // Can turn this off to avoid using the cached copy.

//mm  class BookAbbreviation {     // internal class for book name abbreviations
class BookAbbreviation {
    constructor(row) {
        //mm ~integer id
        this.id = row.id;
        //mm ~String name
        this.name = row.a;
        //mm ~integer bookNumber
        this.bookNumber = row.b;
        //mm ~boolean isPrimary
        this.primary = row.p;
    }
}

//mm }
//mm Book *-- BookAbbreviation
//mm  class Book {
export class Book {

    constructor(row) {

        this.chapsLoaded = false;
        this.xrefsLoaded = false;
        if (row) {
            //mm +integer ordinal;     // ordinal among all Books in a Bible
            this.ordinal = row.order;
            //mm +integer bookNumber;   // same as ordinal
            this.bookNumber = row.order;
            //mm +String name  // short and unique name of the book
            this.name = row.title_short;
            //mm +String title  // longer descriptive name of the book
            this.title = row.title_full;
            //mm +String category  // one of several categories of books
            this.category = row.category;
            //mm +integer nChapters  // number of chapters in this book
            this.nChapters = row.chapters;
            //mm +Chapter chapters[]
            this.chapters = [];

            //mm +Location location;   // location within the Bible
            this.location = new Location();
            this.location.setBook(this.ordinal);
            this.location.getId();  // establishes id from path. 
        } else {
            this.ordinal = 0;
            this.name = '';
            this.title = '';
            this.category = '';
            this.nChapters = 0;
            this.chapters = [];
        }

        //mm  integer firstXref
        this.firstXref = 0;
        //mm  integer lastXref
        this.lastXref = 0;
    }

    loadMyContents() {
        if (traceBook) console.log("Book.mjs - Loading contents of Book #", this.ordinal, " ", this.name, " has ", this.nChapters, " chapters.");
        // for ( let chapterNum = 1; chapterNum < this.nChapters; chapterNum++ ) {
        //     newChapter = new Chapter(this,chapterNum);
        //     this.chapters.push( newChapter );
        // }
        // if ( traceBook )  console.log("Book.mjs - results: ", this);
    }

    //mm Bible theBible$   // first and possibly only Bible loaded
    static theBible;
    //mm BookAbbreviation abbreviationList[]$   // array of abbreviation names
    static abbreviationList;
    //mm Map[String name: integer bookOrdinal]$   // map of names to book ordinals
    static abbreviationMap;

    //mm getBookByName(String name)$ Book   // returns a book by name or abbreviation
    static getBookByName(name) {
        let ord = Book.abbreviationMap.get(name);
        let books = allBooks;
        if (books === undefined)
            books = Book.theBible.books;
        return books[ord - 1];
    }

    //mm getBookByNumber(ordinal)$ Book   // returns a book by it's ordinal
    static getBookByNumber(ord) {
        let books = allBooks;
        if (books === undefined)
            books = theBible.books;
        return books[ord - 1];
    }

    //mm ~setBible(aBible)$   // sets the Bible that contains this book
    static setBible(aBible) {
        this.theBible = aBible;
        Bible.booksPath = this.theBible.bibleLibraryPath + '/books.json';
    }

    //mm ~loadConetnts(aBook)$   
    static loadContents(aBook) {
        // aBook.loadMyContents();
        if (traceBook) console.log("Book.mjs - Loading contents of Book #", aBook.ordinal, " ", aBook.name,
            " has ", aBook.nChapters, " chapters.");
        if (!aBook.chapsLoaded) {
            for (let chapterNum = 1; chapterNum <= aBook.nChapters; chapterNum++) {
                let newChapter = new Chapter(aBook, chapterNum);
                aBook.chapters.push(newChapter);
                Chapter.loadContents(newChapter);
            }
            aBook.chapsLoaded = true;
        }
        if (traceBook) console.log("Book.mjs - Checking for cross references for Book #",
            aBook.ordinal, " ", aBook.name);
        if (!aBook.xrefsLoaded) {
            let nXrefsLoaded = 0;
            let allXrefs = this.theBible.xrefs;
            if (allXrefs) {
                if (aBook.firstXref > 0 && aBook.lastXref > 0) {

                    for (let xrefNumber = aBook.firstXref; xrefNumber <= aBook.lastXref; xrefNumber++) {
                        let xref = allXrefs[xrefNumber];
                        if (xref.sourceBook == aBook.bookNumber) {
                            // currently books don't have arrays of xrefs
                            //   aBook.xrefs.push(xref);
                            let aChap = aBook.chapters[xref.sourceChapter - 1];
                            // currently chapters don't have arrays of xrefs either
                            let aVerse = aChap.verses[xref.sourceVerse - 1];
                            aVerse.xrefs.push(xref);
                            if (traceBook) console.log("Xref from " + aBook.name + " "
                                + aChap.chapterNumber + ":" + aVerse.verseNumber + JSON.stringify(xref));
                            nXrefsLoaded++;
                            if (traceBook) console.log("Book.mjs " + nXrefsLoaded + " into " + aBook.name + " ")
                        }
                    }
                    aBook.xrefsLoaded = true;

                }
            }
        }

        if (traceBook) console.log("Book.mjs - results: ", aBook);
        return aBook;
    }

    //mm ~loadAll(aBible)$   // loads all books into the specified Bible
    static loadAll(aBible) {
        Book.registerEndpoints();
        if (readBooksJson) {
            if (fs.existsSync(Bible.booksPath)) {
                const booksData = fs.readFileSync(Bible.booksPath, (error) => {
                    if (error) {
                        console.log('An error has occurred reading books', error);
                        return;
                    }
                    if (traceBook) console.log('Books data read successfully from disk');
                });

                if (booksData !== undefined && booksData.length > 2) {
                    allBooks = JSON.parse(booksData);
                }
            }
        }
        let databaseError = undefined;

        if (!Book.abbreviationMap) {
            // If abbreviations are not yet loaded, do so now.
            Book.abbreviationMap = new Map();   // keyed by a name, result is book ordinal.
            Book.abbreviationList = [];
            try {
                let sql = `SELECT *
                           FROM key_abbreviations_english`;
                let dSource = aBible.dSource;
                if (dSource === undefined)
                    dSource = Book.theBible.dSource;
                const query = dSource.prepare(sql);
                if (traceBook) console.log("Database query '", sql, "'. prepared. Query=", query);
                const arows = query.all();
                //  dSource.finish(query);

                // As each row is read from the database this
                // forEach loop is run.  In that loop the row
                // is used to build a new Book object which is
                // then added to the array of books in theBible.
                arows.forEach((arow) => {
                    if (traceBook) console.log(arow.a, " is abbreviation for book ", arow.b)
                    Book.abbreviationMap.set(arow.a, arow.b);
                    const newAbbreviation = new BookAbbreviation(arow);
                    Book.abbreviationList.push(newAbbreviation);
                });
            } catch (error) {
                databaseError = error;
                if (traceBook) console.log("Books ERROR: encountered reading abbreviations from database.", error);
            }
            // Since we just loaded them from the database, save a json version.
            this.saveAbbreviations(Book.theBible);
        }

        // If we loaded all books from the json cache file then just return them now.
        if (allBooks !== undefined) {
            if (Book.theBible !== undefined) {
                Book.theBible.booksComplete = true;
                Book.theBible.books = allBooks;
            }
            return;
        }
        if (aBible !== undefined && Book.theBible === undefined) Book.theBible = aBible;

        try {
            let newBooks = [Book];
            let sql = `SELECT *
                       FROM book_info`;
            const dSource = Book.theBible.dSource;
            const query = dSource.prepare(sql);
            if (traceBook) console.log("Database query '", sql, "'. prepared. Query=", query);
            const rows = query.all();
            // dSource.finish(query);

            // As each row is read from the database this
            // forEach loop is run.  In that loop the row
            // is used to build a new Book object which is
            // then added to the array of books in theBible.
            rows.forEach((row) => {
                const book = new Book(row);
                if (traceBook) console.log(`Book[${book.ordinal}] ${book.name} loaded.`)
                if (traceBook) console.log(book);
                Book.theBible.addBook(book);
                newBooks.push(book);
            });
            // When all rows have been read, we notify the Bible
            // that the query is all finished.
            if (aBible === undefined)
                aBible = Book.theBible;

            aBible.booksComplete = true;
            if (traceBook) console.log("Bible notified booksComplete.");

            // close the database connection
            // database.close();
            return undefined; // no errors.
        } catch (error) {
            databaseError = error;
            if (traceBook) console.log("Books ERROR: encountered reading books from database.", error);
            return databaseError;
        }
    }

    //mm ~saveAll(theBible)$   // saves all the Books in a Bible to books json file
    static saveAll = function saveAll(theBible) {

        if (theBible !== undefined && theBible.books !== undefined) {
            if (traceBook) console.log(theBible.books);

            // convert JSON object to a string
            const jsonData = JSON.stringify(theBible.books)

            // write JSON string to a file
            fs.writeFile(Bible.booksPath, jsonData, err => {
                if (err) {
                    throw err
                }
                if (traceBook) console.log('Books JSON data is saved.')
            })

        }
    }

    //mm ~saveAbbreviations(theBible)$   // saves all of the book abbreviations to a json file
    static saveAbbreviations = function saveAbbreviations(theBible) {

        Bible.booksAbbreviationPath = theBible.bibleLibraryPath + '/book-abbreviations.json';
        // Save the abbreviations table
        if (Book.abbreviationList !== undefined) {
            if (traceBook) console.log(Book.abbreviationList);

            // convert JSON object to a string
            const jsonData = JSON.stringify(Book.abbreviationList)

            // write JSON string to a file
            fs.writeFile(Bible.booksAbbreviationPath, jsonData, err => {
                if (err) {
                    throw err
                }
                if (traceBook) console.log('book abbreviations JSON data is saved.')
            })

        }
    }

    /////// - - - - REST endpoints - - - - - -

    static handleBooks( endpoint, request, response, urlArray, urlOptionsArray ) {
        if ( request.method === 'GET' )
        {
            const dataText = JSON.stringify(Bible.getBible().getBooks()) + '\n';
            if ( traceBook) console.log(dataText);
            response.setHeader("Content-Type","application/json");
            response.writeHead(200);
            response.end(dataText);
        }
    }


    static handleAbbreviations( endpoint, request, response, urlArray, urlOptionsArray ) {
        if ( request.method === 'GET' )
        {
            const dataText = JSON.stringify(Book.abbreviationList) + '\n';
            if ( traceBook) console.log(dataText);
            response.setHeader("Content-Type","application/json");
            response.writeHead(200);
            response.end(dataText);
        }
    }

    static handleBook( endpoint, request, response, urlArray, urlOptionsArray ) {
        let specifier = urlArray[3];
        let type = typeof specifier;
        let books = Bible.getBible().getBooks();
        let book;
        if ( type == "string" ) {
            if ( /\d/.test(specifier) )
              type = "number";
        }
        if ( type == "number" )
            book = Book.getBookByNumber(specifier);
        else if ( type == "string" )
            book = Book.getBookByName(specifier);
        else return false;
        let option = urlArray[4];
        if ( option == "contents" )
        {
            Book.loadContents(book);
        }

        if ( request.method === 'GET' )
        {
            const dataText = JSON.stringify(book) + '\n';
            if ( traceBook) console.log(dataText);
            response.setHeader("Content-Type","application/json");
            response.writeHead(200);
            response.end(dataText);
        }
    }

    static registerEndpoints(){

        let endpoint;
        endpoint = new RESTendpoint( "books", Bible, Book.handleBooks );
        RESTendpoint.registerEndpoint( endpoint );

        endpoint = new RESTendpoint( "book", Bible, Book.handleBook );
        RESTendpoint.registerEndpoint( endpoint );

        endpoint = new RESTendpoint( "bookAbbreviations", Bible, Book.handleAbbreviations );
        RESTendpoint.registerEndpoint( endpoint );

    }
//mm }
//mm Bible *-- Book
//mm Book *-- Chapter
//mm Chapter *-- Verse
//mm Book *-- Note
//mm ```

}  // end of class Book



//if ( traceBook ) console.log('ready to load');
//Book.load(theBible);
// if ( traceBook ) console.log("loaded, now to Strange execution timing.txt it all.")
//Book.saveAll(theBible);
if (Book.theBible !== undefined) theBible.bookInitialized = true;
if (traceBook) console.log('Book.mjs initialized.');

export default {
    Book
};
