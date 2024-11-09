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

const traceBook = true;
if (traceBook) console.log('Book.js initializing.');
//import allBooks from './books.json' assert { type: 'json' };

let allBooks;
const fs = require('fs');
const booksPath = './books.json';
if (fs.existsSync(booksPath)) {
    const booksData = fs.readFileSync(booksPath, (error) => {
        if (error) {
            console.log('An error has occurred reading books', error);
            return;
        }
        if (traceBook) console.log('Books data read successfully from disk');
    });

    if (booksData != undefined && booksData.length > 2) {
        allBooks = JSON.parse(booksData);
    }

}

const Bible = require('./Bible.js');

let theBible;

// let theBible = new Bible();

class Book {
    constructor(row) {
        this.ordinal = row.order;
        this.name = row.title_short;
        this.title = row.title_full;
        this.category = row.category;
        this.nChapters = row.chapters;
    }
}

Book.setBible = function (aBible) {
    theBible = aBible;
}

Book.loadAll = function load(aBible) {

    if (allBooks != undefined) {
        theBible.books = allBooks;
        if (theBible != undefined) theBible.booksComplete = true;
        return;
    }
    const sqlite3 = require('sqlite3').verbose();
    if (aBible != undefined && theBible == undefined) theBible = aBible;

// open the database
    let db = new sqlite3.Database('./Data/bible-sqlite.db');

    // StateMachine:  This is where it gets weird.  This Promise
    // calls db.all which is run in a separate task.  The db.all
    // loop does asych i/o.
    let promiseToReadBooks = new Promise((resolve, reject) => {
        let newBooks = [Book];
        let sql = `SELECT *
                   FROM book_info`;

        db.all(sql, [], (err, rows) => { // this is a callback function 
            // In a db task, this reads from the database.
            if (err) {
                throw err;
            }
            // As each row is read from the database this
            // forEach loop is run.  In that loop the row
            // is used to build a new Book object which is 
            // then added to the array of books in theBible.
            rows.forEach((row) => {
                book = new Book(row);
                if (traceBook) console.log(`Book[${book.ordinal}] ${book.name} loaded.`)
                if (traceBook) console.log(book);
                theBible.addBook(book);
                newBooks.push(book);
            });
            // When all rows have been read, we notify the Bible
            // that the query is all finished.  
            if (theBible != undefined) theBible.booksComplete = true;
            resolve(newBooks);
        });
        // close the database connection
        db.close();
      //  resolve('Books sent to theBible');

    })

    // I still don't fully understand how this works.
    promiseToReadBooks.then(
        // .then gets called when the entire promise is fulfilled
        function (value) {
            theBible.booksComplete = true;
        },
        // but if it failed, then the error function is called 
        // to register the failure.  That gets returned to 
        // the Bible's
        function (error) {
            theBible.booksReadError = error;
        }
    );

    console.log('promise has been made.?');
    return promiseToReadBooks;
}

Book.saveAll = function saveAll(theBible) {

    if (theBible != undefined && theBible.books != undefined) {
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

//if ( traceBook ) console.log('ready to load');
//Book.load(theBible);
// if ( traceBook ) console.log("loaded, now to Strange execution timing.txt it all.")
//Book.saveAll(theBible);
if (theBible != undefined) theBible.bookInitialized = true;
if (traceBook) console.log('Book.js initialized.');

module.exports = Book;
