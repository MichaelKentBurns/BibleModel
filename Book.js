const traceBook = true;
if ( traceBook ) console.log('Book.js initializing.');

const fs = require('fs')
const Bible = require('./Bible.js');
let theBible;
// let theBible = new Bible();

class Book {
    constructor(row) {
        this.ordinal     = row.order;
        this.name        = row.title_short;
        this.title       = row.title_full;
        this.category    = row.category;
        this.nChapters   = row.chapters;
    }
}
Book.setBible = function ( aBible ) {
    theBible = aBible;
}
Book.load = function load( aBible ) {
    const sqlite3 = require('sqlite3').verbose();
    if ( aBible != undefined && theBible == undefined ) theBible = aBible;
// open the database
    let db = new sqlite3.Database('./Data/bible-sqlite.db');

    let sql = `SELECT * FROM book_info`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            book = new Book(row);
            theBible.AddBook(book);
            if ( traceBook ) console.log(`Book[${book.ordinal}] ${book.name} loaded.`)
            if ( traceBook ) console.log(book);
        });

        if ( theBible != undefined ) theBible.booksComplete = true;
    });
// close the database connection
    db.close();
}

Book.saveAll = function saveAll(theBible) {

    if ( theBible != undefined && theBible.books != undefined) {
        if ( traceBook ) console.log(theBible.books);

        // convert JSON object to a string
        const jsonData = JSON.stringify(theBible.books)

        // write JSON string to a file
        fs.writeFile('books.json', jsonData, err => {
            if (err) {
                throw err
            }
            if ( traceBook ) console.log('Books JSON data is saved.')
        })

    }

}

//if ( traceBook ) console.log('ready to load');
//Book.load(theBible);
// if ( traceBook ) console.log("loaded, now to save it all.")
//Book.saveAll(theBible);
if ( theBible != undefined ) theBible.bookInitialized = true;
if ( traceBook ) console.log('Book.js initialized.');

module.exports = Book;
