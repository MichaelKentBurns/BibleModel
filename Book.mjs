//
//  Class:  Book
//
//  A holy writing considered as part of the Canon of a faith.
//  A Book is ultimately a sequence of words with appropriate punctuation.
//  In modern forms it is composed of a sequence of chapters.
//  Usually attributed to a specific author.
//
//  Responsibilities:
//      The formal name.
//      A longer descriptive name.
//      Abbreviations for the name.
//      The name of the author.
//      Introductory text.
//
//  Collaborators:
//      The Bible that contains this book.
//      The Testament that contains this book.
//      Chapters - A sequence of numbered chapters that form this book.
//

const traceBook = false;
if (traceBook) console.log('Book.mjs initializing.');
import  { DatabaseSync }  from 'node:sqlite';
import fs from 'node:fs';

let allBooks;  // array of books loaded
// In saveBooks below we cache the list of books in a JSON file.
// If we find it still there, this will read it in to avoid a trip to database.
const readBooksJson = true;      // Can turn this off to avoid using the cached copy.
const booksPath = './books.json';
if (readBooksJson) {
    if (fs.existsSync(booksPath)) {
        const booksData = fs.readFileSync(booksPath, (error) => {
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

let theBible;   // Books' memory of the singleton Bible

export class Book {
    constructor(row) {
        this.ordinal = row.order;
        this.name = row.title_short;
        this.title = row.title_full;
        this.category = row.category;
        this.nChapters = row.chapters;
    }

    static setBible(aBible) {
        theBible = aBible;
    }

    static loadAll(aBible) {

        // If we loaded all books from the json cache file then just return them now.
        if (allBooks !== undefined) {
            if (theBible !== undefined) {
                theBible.booksComplete = true;
                theBible.books = allBooks;
            }
            return;
        }
        if (aBible !== undefined && theBible === undefined) theBible = aBible;

        try {

        // open the database
        const database = new DatabaseSync('./Data/bible-sqlite.db');

            let newBooks = [Book];
            let sql = `SELECT *
                       FROM book_info`;
            const query = database.prepare(sql);
            console.log("Database query '", sql, "'. prepared. Query=", query);
            const rows = query.all();

            // As each row is read from the database this
            // forEach loop is run.  In that loop the row
            // is used to build a new Book object which is
            // then added to the array of books in theBible.
            rows.forEach((row) => {
                const book = new Book(row);
                if (traceBook) console.log(`Book[${book.ordinal}] ${book.name} loaded.`)
                if (traceBook) console.log(book);
                theBible.addBook(book);
                newBooks.push(book);
            });
            // When all rows have been read, we notify the Bible
            // that the query is all finished.
            if (theBible !== undefined) {
                theBible.booksComplete = true;
                if (traceBook) console.log("Bible notified booksComplete.");
            }
        // close the database connection
        database.close();
        return undefined; // no errors.
        }
        catch (error) {
            if (traceBook) console.log("Books ERROR: encountered reading books from database.", error);
            return error;
        }
    }

    static saveAll = function saveAll(theBible) {

        if (theBible !== undefined && theBible.books !== undefined) {
            if (traceBook) console.log(theBible.books);

            // convert JSON object to a string
            const jsonData = JSON.stringify(theBible.books)

            // write JSON string to a file
            fs.writeFile('books.json', jsonData, err => {
                if (err) {
                    throw err
                }
                if (traceBook) console.log('Books JSON data is saved.')
            })

        }
    }
}

//if ( traceBook ) console.log('ready to load');
//Book.load(theBible);
// if ( traceBook ) console.log("loaded, now to Strange execution timing.txt it all.")
//Book.saveAll(theBible);
if (theBible !== undefined) theBible.bookInitialized = true;
if (traceBook) console.log('Book.mjs initialized.');

export default {
    Book //, loadAll
    //   setBible
};
