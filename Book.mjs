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

export class Book {
    constructor(row) {
        if ( row ) {
            this.ordinal = row.order;
            this.name = row.title_short;
            this.title = row.title_full;
            this.category = row.category;
            this.nChapters = row.chapters;
        }
        else
        {
            this.ordinal = 0;
            this.name = '';
            this.title = '';
            this.category =  '';
            this.nChapters = 0;
        }
    }

    static theBible;
    static abbreviations;
    static getBookByName(name) {
        let ord = Book.abbreviations.get(name);
        let books = allBooks;
        if ( books === undefined )
            books = Book.theBible.books;
        return books[ord-1];
    }

    static getBookByNumber(ord) {
        let books = allBooks;
        if ( books === undefined )
            books = theBible.books;
        return books[ord-1];
    }

    static setBible(aBible) {
        this.theBible = aBible;
    }

    static loadAll(aBible) {
        let databaseError = undefined;

        if (!Book.abbreviations) {
            // If abbreviations are not yet loaded, do so now.
            Book.abbreviations = new Map();   // keyed by a name, result is book ordinal.
            try {
                let sql = `SELECT *
                           FROM key_abbreviations_english`;
                let dSource = aBible.dSource;
                if (dSource === undefined )
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
                    if (traceBook) console.log(arow.a," is abbreviation for book ", arow.b)
                    Book.abbreviations.set(arow.a, arow.b);
                });
            } catch (error) {
                databaseError = error;
                if (traceBook) console.log("Books ERROR: encountered reading abbreviations from database.", error);
            }
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
            if ( aBible === undefined )
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
if (Book.theBible !== undefined) theBible.bookInitialized = true;
if (traceBook) console.log('Book.mjs initialized.');

export default {
    Book //, loadAll
    //   setBible
};
